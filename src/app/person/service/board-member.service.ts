import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BoardMember} from "../model/board-member";
import {Observable} from "rxjs/internal/Observable";
import {Service} from "./service";

@Injectable()
export class BoardMemberService implements Service<BoardMember>{

  baseUrl: string = "http://localhost:8080/boardMembers";

  constructor(private http: HttpClient) { }

  findAll(): Observable<BoardMember[]> {
    return this.http.get<BoardMember[]>(this.baseUrl);
  }

  findById(id: string) {
    return this.http.get<BoardMember>(`${this.baseUrl}/${id}`);
  }

  findAllByDivisionIsNull() {
    return this.http.get<BoardMember[]>(`${this.baseUrl}/divisionIsNull`);
  }

  delete(id: string) {
  }

  search(): Observable<BoardMember[]> {
    return undefined;
  }

  save(e: BoardMember): Observable<BoardMember> {
    return undefined;
  }

  update(e: BoardMember): Observable<BoardMember> {
    return undefined;
  }
}
