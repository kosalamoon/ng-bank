import { Injectable } from '@angular/core';
import {Service} from "../../person/service/service";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../shared/const/constants";

@Injectable()
export class AccountService {

  constructor(private http: HttpClient) { }

  url: string = baseURL + "accounts";

  delete(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }

  findAll(): Observable<Account[]> {
    return this.http.get<Account[]>(this.url);
  }

  findById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.url}/${id}`);
  }

  save(e: {}): Observable<Account> {
    return this.http.post<Account>(this.url, e);
  }

  search(e: {}): Observable<Account[]> {
    return this.http.put<Account[]>(`${this.url}/search`, e);
  }

  update(e: Account): Observable<Account> {
    return this.http.put<Account>(this.url, e);
  }
}
