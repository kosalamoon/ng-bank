import {Injectable} from "@angular/core";
import {Service} from "../../person/service/service";
import {Meeting} from "../model/meeting";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../md-components/const/constants";

@Injectable()
export class MeetingService implements Service<Meeting>{

  url: string = baseURL + "meetings";

  constructor(private http: HttpClient) {}

  delete(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }

  findAll(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(this.url);
  }

  findById(id: string): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.url}/${id}`);
  }

  save(e: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(this.url, e);
  }

  search(e: {}): Observable<Meeting[]> {
    return this.http.put<Meeting[]>(`${this.url}/search`, e);
  }

  update(e: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(this.url, e);
  }


}
