import {Injectable} from "@angular/core";
import {Service} from "./service";
import {Meeting} from "../model/meeting";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class MeetingService implements Service<Meeting>{

  baseUrl: string = "http://localhost:8080/meetings";

  constructor(private http: HttpClient) {}

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  findAll(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(this.baseUrl);
  }

  findById(id: string): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.baseUrl}/${id}`);
  }

  save(e: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(this.baseUrl, e);
  }

  search(e: {}): Observable<Meeting[]> {
    return this.http.put<Meeting[]>(`${this.baseUrl}/search`, e);
  }

  update(e: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(this.baseUrl, e);
  }


}
