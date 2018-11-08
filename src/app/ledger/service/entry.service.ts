import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
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
      let params = new HttpParams().append("fromDate", fromDate).append("toDate", toDate);
      return this.http.get<Entry[]>(this.url, {params: params});
    }
    return this.http.get<Entry[]>(this.url);
  }

  findAllByAccountNumber(number: string, fromDate: string = null, toDate: string = null): Observable<Entry[]> {
    if (fromDate != null && toDate != null) {
      let params = new HttpParams()
        .append("fromDate", fromDate)
        .append("toDate", toDate);
      return this.http.get<Entry[]>(`${this.url}/account/number/${number}`, {params: params});
    }
    return this.http.get<Entry[]>(`${this.url}/account/number/${number}`);
  }

  findTop5ByAccountNumber(number: string): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.url}/top5/account/number/${number}`);
  }

  findById(id: string): Observable<Entry> {
    return this.http.get<Entry>(`${this.url}/${id}`);
  }

  save(e: Entry): Observable<Entry> {
    return undefined;
  }

  search(e: {}, fromDate?: string, toDate?: string): Observable<Entry[]> {
    if (fromDate != null && toDate != null) {
      let params = new HttpParams().append("fromDate", fromDate).append("toDate", toDate);
      return this.http.put<Entry[]>(`${this.url}/search`, e, {params: params});
    }
    return this.http.put<Entry[]>(`${this.url}/search`, e);
  }

  update(e: Entry): Observable<Entry> {
    return undefined;
  }

}
