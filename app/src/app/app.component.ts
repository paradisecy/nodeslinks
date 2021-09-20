import {Component} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  // tslint:disable-next-line:variable-name
  data;
  constructor(private http: HttpClient) {
    this.getData().subscribe(data => {
      debugger
      this.data = data.dag;
      console.log(this.data);
    });
  }

  handleFileInput(files: FileList, mode) {
    const file: any = files.item(0);

    combineLatest(this.postFile(file, mode), this.getData())
      .subscribe(([p, g]) => {
      console.log(p, g);
    });

  }

  postFile(fileToUpload: File, mode): Observable<boolean> {
    const endpoint = 'http://localhost:9999/api/upload';
    const formData: FormData = new FormData();
    formData.append('fileUp', fileToUpload, fileToUpload.name);
    const blob = new Blob();
    formData.append('mode', blob, mode);
    // @ts-ignore
    return this.http
      .post(endpoint, formData);
  }

  getData(): Observable<any> {
    const endpoint = 'http://localhost:9999/api/main';
    // @ts-ignore
    return this.http
      .get(endpoint);
  }


}
