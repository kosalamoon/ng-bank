import {Injectable} from "@angular/core";
import {Service} from "../../person/service/service";
import {Savings} from "../model/savings";
import {Observable} from "rxjs/internal/Observable";
import {baseURL} from "../../shared/const/constants";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class SavingsService implements Service<Savings> {

  url: string = baseURL + "savings";

  constructor(private http: HttpClient) {
  }

  delete(id: string): void {
  }

  findAll(): Observable<Savings[]> {
    return this.http.get<Savings[]>(this.url);
  }

  findById(id: string): Observable<Savings> {
    return this.http.get<Savings>(`${this.url}/${id}`);
  }

  save(e: Savings): Observable<Savings> {
    return this.http.post<Savings>(this.url, e);
  }

  search(e: {}): Observable<Savings[]> {
    return this.http.put<Savings[]>(`${this.url}/search`, e);
  }

  update(e: Savings): Observable<Savings> {
    return this.http.put<Savings>(this.url, e);
  }


}
