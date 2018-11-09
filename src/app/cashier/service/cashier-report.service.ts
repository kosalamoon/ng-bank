import {Injectable} from '@angular/core';
import {baseURL} from "../../shared/const/constants";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CashierReportService {

  url: string = baseURL + "cashier/";

  constructor(private http: HttpClient) { }

  deposit(id: string, operationType: string) {
    let params = new HttpParams().append("operationType", operationType);
    return this.http.get(`${this.url}deposit/transaction/${id}`, {params: params, responseType: 'blob'});
  }

  share(id: string) {
    return this.http.get(`${this.url}shares/transaction/${id}`, {responseType: 'blob'});
  }

  team(id: string) {
    return this.http.get(`${this.url}teams/transaction/${id}`, {responseType: 'blob'});
  }

  loan(id: string) {
    return this.http.get(`${this.url}loans/transaction/${id}`, {responseType: 'blob'});
  }
}
