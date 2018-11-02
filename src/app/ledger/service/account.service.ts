import {Injectable} from "@angular/core";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";
import {baseURL, responseType} from "../../shared/const/constants";
import {Account} from "../model/account";

@Injectable()
export class AccountService {

  constructor(private http: HttpClient) { }

  url: string = baseURL + "accounts";

  delete(id: string) {
    return this.http.delete<string>(`${this.url}/${id}`, responseType);
  }

  findAll(): Observable<Account[]> {
    return this.http.get<Account[]>(this.url);
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
}
