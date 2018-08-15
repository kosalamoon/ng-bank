import { Injectable } from '@angular/core';
import {Service} from "../../person/service/service";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AccountService implements Service<Account>{

  constructor(private http: HttpClient) { }

  baseUrl: string = "http://localhost:8080";

  delete(id: string) {
  }

  findAll(): Observable<Account[]> {
    return undefined;
  }

  findById(id: string): Observable<Account> {
    return undefined;
  }

  save(e: Account): Observable<Account> {
    return undefined;
  }

  search(e: {}): Observable<Account[]> {
    return undefined;
  }

  update(e: Account): Observable<Account> {
    return undefined;
  }
}
