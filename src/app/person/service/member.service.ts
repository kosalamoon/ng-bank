import {Injectable} from "@angular/core";
import {Service} from "./service";
import {Member} from "../model/member";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";
import {baseURL, responseType} from "../../shared/const/constants";

@Injectable()
export class MemberService implements Service<Member> {

  url: string = baseURL + "members";

  constructor(private http: HttpClient) {
  }

  delete(id: string) {
    return this.http.delete<string>(`${this.url}/${id}`, responseType);
  }

  findAll(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.url}`);
  }

  findAllByTeamId(id: string) {
    return this.http.get<Member[]>(`${this.url}/teams/${id}`);
  }

  findById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.url}/${id}`);
  }

  save(e: Member): Observable<Member> {
    return this.http.post<Member>(`${this.url}`, e);
  }

  search(e: {}): Observable<Member[]> {
    return this.http.put<Member[]>(`${this.url}/search`, e);
  }

  update(e: Member): Observable<Member> {
    return this.http.put<Member>(`${this.url}`, e);
  }


}
