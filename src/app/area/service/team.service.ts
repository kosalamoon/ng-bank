import {Injectable} from "@angular/core";
import {Service} from "../../person/service/service";
import {Team} from "../model/team";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../shared/const/constants";

@Injectable({
  providedIn: 'root'
})
export class TeamService implements Service<Team>{

  constructor(private http: HttpClient) { }

  url: string = baseURL + 'teams';

  delete(id: string) {
    return this.http.delete<Team>(`${this.url}/${id}`);
  }

  findAll(): Observable<Team[]> {
    return this.http.get<Team[]>(this.url)
  }

  findAllBySocietyId(id: string): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.url}/society/${id}`);
  }

  findById(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.url}/${id}`)
  }

  findByMemberId(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.url}/members/${id}`);
  }

  save(e: Team): Observable<Team> {
    return this.http.post<Team>(this.url, e);
  }

  search(e: {}): Observable<Team[]> {
    return this.http.put<Team[]>(`${this.url}/search`, e);
  }

  update(e: Team): Observable<Team> {
    return this.http.put<Team>(this.url, e);
  }

}
