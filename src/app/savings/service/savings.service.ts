import {Injectable} from "@angular/core";
import {Service} from "../../person/service/service";
import {Savings} from "../model/savings";
import {Observable} from "rxjs/internal/Observable";
import {baseURL, responseType} from "../../shared/const/constants";
import {HttpClient} from "@angular/common/http";
import {LineChart} from "../../core/model/line-chart";
import {PieChart} from "../../core/model/pie-chart";

@Injectable()
export class SavingsService implements Service<Savings> {

  url: string = baseURL + "savings";

  constructor(private http: HttpClient) {
  }

  delete(id: string){
    return this.http.delete<string>(`${this.url}/${id}`, responseType);
  }

  findAll(): Observable<Savings[]> {
    return this.http.get<Savings[]>(this.url);
  }

  findAllByMember(id: string) {
    return this.http.get<Savings[]>(`${this.url}/members/${id}`);
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

  reportByType() {
    return this.http.get<LineChart>(`${this.url}/report/all`);
  }

  getPieChart() {
    return this.http.get<PieChart>(`${this.url}/report/pieChart`);
  }


}
