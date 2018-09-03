import {Injectable} from "@angular/core";
import {Service} from "../../person/service/service";
import {Savings} from "../../savings/model/savings";
import {Observable} from "../../../../node_modules/rxjs";
import {baseURL} from "../../shared/const/constants";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class SavingsService implements Service<Savings> {

  url: string = baseURL + "savings";

  constructor(private http: HttpClient) {
  }

  delete(id: string) {
  }

  findAll(): Observable<Savings[]> {
    return undefined;
  }

  findById(id: string): Observable<Savings> {
    return this.http.get<Savings>(`${this.url}/${id}`);
  }

  save(e: Savings): Observable<Savings> {
    return undefined;
  }

  search(e: {}): Observable<Savings[]> {
    return undefined;
  }

  update(e: Savings): Observable<Savings> {
    return undefined;
  }


}
