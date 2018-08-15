import {Injectable} from "@angular/core";
import {Division} from "../model/division";
import {HttpClient} from "@angular/common/http";
import {Service} from "../../person/service/service";
import {Observable} from "rxjs/internal/Observable";
import {baseURL} from "../../shared/const/constants";

@Injectable()
export class DivisionService implements Service<Division>{

  constructor(private http: HttpClient) {}

  url: string = baseURL + 'divisions';

  delete(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }

  findAll(): Observable<Division[]> {
    return this.http.get<Division[]>(this.url);
  }

  findById(id: string): Observable<Division> {
    return this.http.get<Division>(`${this.url}/${id}`);
  }

  save(e: Division): Observable<Division> {
    return this.http.post<Division>(this.url, e);
  }

  search(e: {}): Observable<Division[]> {
    return this.http.put<Division[]>(`${this.url}/search`, e);
  }

  update(e: Division): Observable<Division>{
    return this.http.put<Division>(this.url, e);
  }


}
