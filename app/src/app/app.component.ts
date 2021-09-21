import {Component} from '@angular/core';
import {concat, Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Edge, Node} from '@swimlane/ngx-graph';

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
  tasks = [];
  dependencies = [];
  baseUrl = 'http://localhost:9999';

  constructor(private http: HttpClient) {
    this.getData().subscribe(data => {
      this.collectionAssigment(data);
    });
  }

  collectionAssigment(data) {
    this.nodes = new Array<Node>();
    this.links = new Array<Edge>();
    this.tasks = data.tasks;
    this.dependencies = data.dep;
    this.nodes = data.nodes;
    this.links = data.links;
  }

  handleFileInput(files: FileList, mode) {
    const file: any = files.item(0);

    concat(this.postFile(file, mode), this.getData())
      .subscribe(data => {
        if (data.dep !== undefined) {
          this.collectionAssigment(data);
          this.updateChart();
        }
      });

  }

  postFile(fileToUpload: File, mode): Observable<boolean> {
    const endpoint = `${this.baseUrl}/api/upload`;
    const formData: FormData = new FormData();
    formData.append('fileUp', fileToUpload, fileToUpload.name);
    const blob = new Blob();
    formData.append('mode', blob, mode);
    // @ts-ignore
    return this.http
      .post(endpoint, formData);
  }

  getData(): Observable<any> {
    const endpoint = `${this.baseUrl}/api/main`;
    // @ts-ignore
    return this.http
      .get(endpoint);
  }

  updateChart() {
    this.update$.next(true);
  }
}
