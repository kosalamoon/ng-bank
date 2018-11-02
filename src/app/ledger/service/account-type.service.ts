import {Injectable} from '@angular/core';
import {Service} from "../../person/service/service";
import {AccountType} from "../model/account-type";
import {Observable} from "rxjs/internal/Observable";
import {baseURL, responseType} from "../../shared/const/constants";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AccountTypeService implements Service<AccountType>{

  constructor(private http: HttpClient) { }

  url: string = baseURL + 'accountTypes';

  delete(id: string) {
    return this.http.delete<string>(`${this.url}/${id}`, responseType);
  }

  findAll(): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(this.url);
  }

  findById(id: string): Observable<AccountType> {
    return this.http.get<AccountType>(`${this.url}/${id}`);
  }

  save(e: AccountType): Observable<AccountType> {
    return this.http.post<AccountType>(this.url, e);
  }

  search(e: {}): Observable<AccountType[]> {
    return this.http.put<AccountType[]>(`${this.url}/search`, e);
  }

  update(e: AccountType): Observable<AccountType> {
    return this.http.put<AccountType>(this.url, e);
  }
}
