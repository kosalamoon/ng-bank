import {Injectable} from "@angular/core";
import {Service} from "./service";
import {Team} from "../model/team";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TeamService implements Service<Team>{

  constructor(private http: HttpClient) { }

  baseUrl: string = 'http://localhost:8080/teams';

  delete(id: string) {
    return this.http.delete<Team>(`${this.baseUrl}/${id}`);
  }

  findAll(): Observable<Team[]> {
    return this.http.get<Team[]>(this.baseUrl)
  }

  findById(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.baseUrl}/${id}`)
  }

  findAllBySocietyId(id: string): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.baseUrl}/society/${id}`);
  }

  save(e: Team): Observable<Team> {
    return this.http.post<Team>(this.baseUrl, e);
  }

  search(e: {}): Observable<Team[]> {
    return this.http.put<Team[]>(`${this.baseUrl}/search`, e);
  }

  update(e: Team): Observable<Team> {
    return this.http.put<Team>(this.baseUrl, e);
  }

}
