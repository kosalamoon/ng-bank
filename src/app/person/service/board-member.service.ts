import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BoardMember} from "../model/board-member";
import {Observable} from "rxjs/internal/Observable";
import {Service} from "./service";
import {baseURL, responseType} from "../../shared/const/constants";

@Injectable()
export class BoardMemberService implements Service<BoardMember>{

  url: string = baseURL + 'boardMembers';

  constructor(private http: HttpClient) { }

  findAll(): Observable<BoardMember[]> {
    return this.http.get<BoardMember[]>(this.url);
  }

  findById(id: string) {
    return this.http.get<BoardMember>(`${this.url}/${id}`);
  }

  findAllByDivisionIsNull() {
    return this.http.get<BoardMember[]>(`${this.url}/divisionIsNull`);
  }

  delete(id: string) {
    return this.http.delete<string>(`${this.url}/${id}`, responseType);
  }

  search(e: {}): Observable<BoardMember[]> {
    return this.http.put<BoardMember[]>(`${this.url}/search`, e);
  }

  save(e: BoardMember): Observable<BoardMember> {
    return this.http.post<BoardMember>(`${this.url}`, e);
  }

  update(e: BoardMember): Observable<BoardMember> {
    return this.http.put<BoardMember>(`${this.url}`, e);
  }
}
