import {Injectable} from "@angular/core";
import {Division} from "../model/division";
import {HttpClient} from "@angular/common/http";
import {Service} from "./service";
import {Observable} from "rxjs/internal/Observable";

@Injectable()
export class DivisionService implements Service<Division>{

  constructor(private http: HttpClient) {}

  baseUrl: string = 'http://localhost:8080/divisions';

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  findAll(): Observable<Division[]> {
    return this.http.get<Division[]>(this.baseUrl);
  }

  findById(id: string): Observable<Division> {
    return this.http.get<Division>(`${this.baseUrl}/${id}`);
  }

  save(e: Division): Observable<Division> {
    return this.http.post<Division>(this.baseUrl, e);
  }

  search(e: {}): Observable<Division[]> {
    return this.http.put<Division[]>(`${this.baseUrl}/search`, e);
  }

  update(e: Division): Observable<Division>{
    return this.http.put<Division>(this.baseUrl, e);
  }


}
