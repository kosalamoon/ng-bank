import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {baseURL} from "../../shared/const/constants";
import {Service} from "../../person/service/service";
import {Entry} from "../model/entry";
import {Observable} from "rxjs/internal/Observable";

@Injectable()
export class EntryService implements Service<Entry> {

  url: string = baseURL + "entries";

  constructor(private http: HttpClient) {
  }

  delete(id: string) {
  }

  findAll(fromDate: string = null, toDate: string = null): Observable<Entry[]> {
    if (fromDate != null && toDate != null) {
      let headers = new HttpHeaders()
        .append("fromDate", fromDate)
        .append("toDate", toDate);
      return this.http.get<Entry[]>(this.url, {headers: headers});
    }
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

  search(e: {}, fromDate: string = null, toDate: string = null): Observable<Entry[]> {
    if (fromDate != null && toDate != null) {
      let params = {"fromDate": fromDate, "toDate": toDate};
      console.log(params);
      return this.http.put<Entry[]>(`${this.url}/search`, e, {params: params});
    }
    return this.http.put<Entry[]>(`${this.url}/search`, e);
  }

  update(e: Entry): Observable<Entry> {
    return undefined;
  }

}
