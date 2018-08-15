import {Injectable} from "@angular/core";
import {Service} from "../../person/service/service";
import {Society} from "../model/society";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class SocietyService implements Service<Society>{

  constructor(private http: HttpClient) { }

  baseUrl: string = "http://localhost:8080/societies";

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  findAll(): Observable<Society[]> {
    return this.http.get<Society[]>(this.baseUrl);
  }

  findAllByDivisionId(id: string) {
    return this.http.get<Society[]>(`${this.baseUrl}/division/${id}`);
  }

  findById(id: string): Observable<Society> {
    return this.http.get<Society>(`${this.baseUrl}/${id}`);
  }

  save(e: Society) {
    return this.http.post<Society>(this.baseUrl, e);
  }

  search(e: {}): Observable<Society[]> {
    return this.http.put<Society[]>(`${this.baseUrl}/search`, e);
  }

  update(e: Society): Observable<Society> {
    return this.http.put<Society>(this.baseUrl, e);
  }
}
