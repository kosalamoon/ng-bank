import {Injectable} from "@angular/core";
import {Service} from "../../person/service/service";
import {Society} from "../model/society";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../md-components/const/constants";

@Injectable()
export class SocietyService implements Service<Society>{

  constructor(private http: HttpClient) { }

  url: string = baseURL + "societies";

  delete(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }

  findAll(): Observable<Society[]> {
    return this.http.get<Society[]>(this.url);
  }

  findAllByDivisionId(id: string) {
    return this.http.get<Society[]>(`${this.url}/division/${id}`);
  }

  findById(id: string): Observable<Society> {
    return this.http.get<Society>(`${this.url}/${id}`);
  }

  save(e: Society) {
    return this.http.post<Society>(this.url, e);
  }

  search(e: {}): Observable<Society[]> {
    return this.http.put<Society[]>(`${this.url}/search`, e);
  }

  update(e: Society): Observable<Society> {
    return this.http.put<Society>(this.url, e);
  }
}
