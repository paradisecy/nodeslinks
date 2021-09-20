import {Component} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
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
  constructor(private http: HttpClient) {
    this.getData().subscribe(data => {
      this.nodes = data.dag.nodes;
      this.links = data.dag.links;
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
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .get(endpoint);
  }


}
