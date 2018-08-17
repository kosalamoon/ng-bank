import { Injectable } from '@angular/core';
import {Service} from "../../person/service/service";
import {AccountType} from "../model/account-type";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class AccountTypeService implements Service<AccountType>{

  constructor() { }

  url: string;

  delete(id: string) {
  }

  findAll(): Observable<AccountType[]> {
    return undefined;
  }

  findById(id: string): Observable<AccountType> {
    return undefined;
  }

  save(e: AccountType): Observable<AccountType> {
    return undefined;
  }

  search(e: {}): Observable<AccountType[]> {
    return undefined;
  }

  update(e: AccountType): Observable<AccountType> {
    return undefined;
  }
}
