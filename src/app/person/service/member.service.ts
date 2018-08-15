import {Injectable} from "@angular/core";
import {Service} from "./service";
import {Member} from "../model/member";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class MemberService implements Service<Member>{
  baseUrl: string = "http://localhost:8080/members";

  constructor(private http: HttpClient) {}

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  findAll(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}`);
  }

  findById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}/${id}`);
  }

  save(e: Member): Observable<Member> {
    return this.http.post<Member>(`${this.baseUrl}`, e)
  }

  search(e: {}): Observable<Member[]> {
    return this.http.put<Member[]>(`${this.baseUrl}/search`, e);
  }

  update(e: Member): Observable<Member> {
    return this.http.put<Member>(`${this.baseUrl}`, e);
  }


}
