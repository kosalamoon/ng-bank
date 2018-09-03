import {Injectable} from "@angular/core";
import {Service} from "../../person/service/service";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../shared/const/constants";
import {Transaction} from "../model/transaction";
import {Observable} from "../../../../node_modules/rxjs";

@Injectable()
export class TransactionService implements Service<Transaction> {

  url: string = baseURL + "transactions";

  constructor(private http: HttpClient) {
  }

  delete(id: string) {
  }

  findAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.url);
  }

  findById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.url}/${id}`);
  }

  findAllByAccountNumber(number: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.url}/entries/accounts/number/${number}`);
  }

  save(e: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.url, e);
  }

  search(e: {}): Observable<Transaction[]> {
    return undefined;
  }

  update(e: Transaction): Observable<Transaction> {
    return undefined;
  }

}
