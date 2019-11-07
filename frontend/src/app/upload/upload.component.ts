import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpEventType, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../environments/environment'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  constructor(private http: HttpClient,
              private router: Router) { }

  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'file';
  /** Target URL for file uploading. */
  @Input() target = environment.postTargetUrl;
  @Input() accept = '*';
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() complete = new EventEmitter<string>();

  private files: Array<FileUploadModel> = [];

  response: any;
  post: any;
  prog: number = 0;

  ngOnInit() {
  }
  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      for(let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({
          data: file, state: 'in',
          inProgress: false, progress: 0, canRetry: false, canCancel: true
        });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }
  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
  }
  private uploadFile(file: FileUploadModel) {
    const fd = new FormData();
    fd.append(this.param, file.data);
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });
    const request = new HttpRequest('POST', this.target, fd, { headers, responseType: 'text' });
    file.inProgress = true;
    const fds = new FormData();
    this.http.request(request).subscribe((data:HttpEvent<any>) => {
      switch (data.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.prog = Math.round(data.loaded / data.total * 100);
          console.log(`Uploaded! ${this.prog}%`);
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', data.body);
          setTimeout(() => {
            this.prog = 0;
          }, 1500);
      this.response = data['body'];
      console.log('abc' + this.response);
        }
    });
  }

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }
  addPost(title, category, tags) {
    const username = localStorage.getItem('username');
    console.log(this.response);
    this.post = {
      id: Math.floor(Math.random() * (10000000 - 0 + 1)) + 0,
      title: title,
      category: category,
      // tags: tags,
      videoUrl: this.response,
      postedBy: {
        username: username
      }
    };
    console.log('testing post 2 ' + JSON.stringify(this.post));
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        })
    };
    this.http.post(environment.uploadPostUrl, this.post, httpOptions).subscribe(data => {
      console.log(data);
    });
    this.router.navigateByUrl('/posted');
  }

}
export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
