import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {debounceTime, map} from "rxjs/operators";
import {JwtHelperService} from "@auth0/angular-jwt";
import {baseURL} from "../shared/const/constants";


export interface ApiResponse {
  success: string;
  message: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {

  url: string = baseURL + "auth";

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
  }

  logIn(username: string, password: string) {
    return this.http.post(`${this.url}/login`, {username, password})
      .pipe(
        map(value => this.setTokenToSession(value["token"])
        )
      );
  }

  logOut(): boolean {
    sessionStorage.removeItem("token");
    return true;
  }

  setTokenToSession(token: string) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("roles", this.jwtHelper.decodeToken(token).roles);
  }

  isAuthenticated(): boolean {
    let token: string = sessionStorage.getItem("token");
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  isAuthorized(role: string) {
    return sessionStorage.getItem("roles").includes(role);
  }

  getUsernameFromToken() {
    return this.jwtHelper.decodeToken(sessionStorage.getItem("token")).username;
  }

  getUserIdFromToken() {
    return this.jwtHelper.decodeToken(sessionStorage.getItem("token")).id;
  }

  changePassword(username: string, password: string) {
    return this.http.post(`${this.url}/changePassword`, {username: username, password: password});

  }

  matchPasswords(username: string, password: string) {
    return this.http.post(`${this.url}/matchPasswords`, {username: username, password: password})
      .pipe(
        debounceTime(2000),
      );
  }

  lockAccount(username: string) {
    return this.http.post<ApiResponse>(`${this.url}/lock`, {username: username});
  }

  checkUsername(username: string) {
    return this.http.post<ApiResponse>(`${this.url}/checkUsername`, username);
  }
}
