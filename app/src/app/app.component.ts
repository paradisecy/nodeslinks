import {Component} from '@angular/core';
import {combineLatest, concat, Observable, Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Edge, Node } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  // tslint:disable-next-line:variable-name
  nodes = new Array<Node>();
  links = new Array<Edge>();
  update$: Subject<any> = new Subject();

  constructor(private http: HttpClient) {
    this.getData().subscribe(data => {


     this.nodes = new Array<Node>();
     this.links =  new Array<Edge>();

     this.nodes = data.nodes;
     this.links = data.links;
    });
  }

  handleFileInput(files: FileList, mode) {
    const file: any = files.item(0);

    concat(this.postFile(file, mode), this.getData())
      .subscribe(d => {
        this.updateChart();
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

  updateChart() {
    this.update$.next(true);
}


}
