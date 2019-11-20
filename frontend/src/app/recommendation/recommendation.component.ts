import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {

  recs: any;
  breakpoint: number;
  posts: any;
  postByAge: any;
  constructor(private http: HttpClient,
              private router: Router) { }

  ngOnInit() {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + localStorage.getItem('jwt')
        })
    };
    this.http.get('https://newszoid.stackroute.io:8443/recommendation-service/recommend/'
      + localStorage.getItem('username'), httpOptions).subscribe(
        (data) => {
          this.posts = data;
        }/*, (error) => {
        this.router.navigateByUrl('/404');
      }*/
      );

      this.http.get('https://newszoid.stackroute.io:8443/recommendation-service/recommend/ageGroup/'
      + localStorage.getItem('username'), httpOptions).subscribe(
        (data) => {
          this.postByAge = data;
        }/*, (error) => {
        this.router.navigateByUrl('/404');
      }*/
      );
    this.breakpoint = (window.innerWidth <= 777) ? 1 : (window.innerWidth <= 1120 && window.innerWidth > 777)
      ? 2 : (window.innerWidth > 1120) ? 3 : 4;
  }

  onResize(event) {
    this.breakpoint = (window.innerWidth <= 777) ? 1 : (window.innerWidth <= 1120 && window.innerWidth > 777)
      ? 2 : (window.innerWidth > 1120) ? 3 : 4;


  }

}
