import { Injectable } from '@angular/core';
import {Service} from "../../person/service/service";
import {SubAccountType} from "../model/sub-account-type";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class SubAccountTypeService implements Service<SubAccountType>{

  constructor() { }

  url: string;

  delete(id: string) {
  }

  findAll(): Observable<SubAccountType[]> {
    return undefined;
  }

  findById(id: string): Observable<SubAccountType> {
    return undefined;
  }

  save(e: SubAccountType): Observable<SubAccountType> {
    return undefined;
  }

  search(e: {}): Observable<SubAccountType[]> {
    return undefined;
  }

  update(e: SubAccountType): Observable<SubAccountType> {
    return undefined;
  }
}
