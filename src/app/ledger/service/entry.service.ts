import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../shared/const/constants";
import {Service} from "../../person/service/service";
import {Entry} from "../model/entry";
import {Observable} from "../../../../node_modules/rxjs";

@Injectable()
export class EntryService implements Service<Entry> {

  url: string = baseURL + "entries";

  constructor(private http: HttpClient) {
  }

  delete(id: string) {
  }

  findAll(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.url);
  }

  findTop3ByAccountNumber(number: string): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.url}/account/number/${number}`);
  }

  findById(id: string): Observable<Entry> {
    return this.http.get<Entry>(`${this.url}/${id}`);
  }

  save(e: Entry): Observable<Entry> {
    return undefined;
  }

  search(e: {}): Observable<Entry[]> {
    return undefined;
  }

  update(e: Entry): Observable<Entry> {
    return undefined;
  }

}
