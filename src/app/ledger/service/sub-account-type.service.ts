import { Injectable } from '@angular/core';
import {Service} from "../../person/service/service";
import {SubAccountType} from "../model/sub-account-type";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../shared/const/constants";
import {AccountType} from "../model/account-type";

@Injectable()
export class SubAccountTypeService implements Service<SubAccountType>{

  constructor(private http: HttpClient) { }

  url: string = baseURL + "subAccountTypes";

  delete(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }

  findAll(): Observable<SubAccountType[]> {
    return this.http.get<SubAccountType[]>(this.url);
  }

  findById(id: string): Observable<SubAccountType> {
    return this.http.get<SubAccountType>(`${this.url}/${id}`);
  }

  save(e: SubAccountType): Observable<SubAccountType> {
    return this.http.post<SubAccountType>(this.url, e);
  }

  search(e: {}): Observable<SubAccountType[]> {
    return this.http.put<SubAccountType[]>(`${this.url}/search`, e);
  }

  update(e: SubAccountType): Observable<SubAccountType> {
    return this.http.put<SubAccountType>(this.url, e);
  }
}
