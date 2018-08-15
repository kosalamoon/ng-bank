import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BoardMember} from "../model/board-member";
import {Observable} from "rxjs/internal/Observable";
import {Service} from "./service";
import {baseURL} from "../../shared/const/constants";

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
