import {Injectable} from "@angular/core";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient, HttpParams} from "@angular/common/http";
import {baseURL, responseType} from "../../shared/const/constants";
import {Account} from "../model/account";
import {DataSet} from "../../loan/model/loan-report";
import {AccountTypeReport} from "../model/account-type-report";

@Injectable()
export class AccountService {

  constructor(private http: HttpClient) {
  }

  url: string = baseURL + "accounts";

  delete(id: string) {
    return this.http.delete<string>(`${this.url}/${id}`, responseType);
  }

  findAll(): Observable<Account[]> {
    return this.http.get<Account[]>(this.url);
  }

  findAllHavingSavings() {
    return this.http.get<Account[]>(`${this.url}/savings`);
  }

  findById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.url}/${id}`);
  }

  findByNumber(number: string): Observable<Account> {
    return this.http.get<Account>(`${this.url}/number/${number}`);
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

  sharesReport() {
    return this.http.get<DataSet[]>(`${this.url}/shares/report`);
  }

  teamReport() {
    return this.http.get<DataSet[]>(`${this.url}/teams/report`);

  }

  incomeStatement(fromDate: string, toDate: string) {
    if (fromDate != null && toDate != null) {
      let params = new HttpParams()
        .append("fromDate", fromDate)
        .append("toDate", toDate);
      return this.http.get<AccountTypeReport[]>(`${this.url}/incomeStatement`, {params: params});
    }
    return this.http.get<AccountTypeReport[]>(`${this.url}/incomeStatement`);
  }

  balanceSheet(fromDate: string, toDate: string) {
    if (fromDate != null && toDate != null) {
      let params = new HttpParams()
        .append("fromDate", fromDate)
        .append("toDate", toDate);
      return this.http.get<AccountTypeReport[]>(`${this.url}/balanceSheet`, {params: params});
    }
    return this.http.get<AccountTypeReport[]>(`${this.url}/balanceSheet`);
  }
}
