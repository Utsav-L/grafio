import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) { }
  private url = 'https://.154.175.62:8443/registration-service/api/v1/register';


  saveUser(userObj): any {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json'
        })
    };
    return this.http.post(this.url, userObj, httpOptions);
  }

  checkToken(tokenStr) {

    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(tokenStr);

    console.log(decodedToken);



    return decodedToken;

  }
  changeUser(userObj, username) {

    const httpOptions = {

      headers: {

        'Content-Type': 'application/json',

        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),

        'Access-Control-Allow-Origin': '*'

      }

    }
    console.log('headers: ', httpOptions.headers);

    return this.http.put<any>('https://.154.175.62:8443/registration-service/api/v1/register/' + username, userObj, httpOptions);

  }

  getUser(username) {

    const httpOptions = {

      headers: {

        'Content-Type': 'application/json',

        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),

        'Access-Control-Allow-Origin': '*'

      }

    }



    console.log('headers: ', httpOptions.headers);

    return this.http.get<any>('https://.154.175.62:8443/registration-service/api/v1/register/' + username, httpOptions);

  }
}
