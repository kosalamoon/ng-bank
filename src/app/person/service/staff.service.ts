import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Staff} from "../model/staff";
import {delay} from "rxjs/operators";
import {Observable} from "rxjs/internal/Observable";
import {Service} from "./service";

@Injectable()
export class StaffService implements Service<Staff>{

  baseUrl: string = "http://localhost:8080/staff";

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.baseUrl);
  }

  findById(id: string): Observable<Staff> {
    return this.http.get<Staff>(`${this.baseUrl}/${id}`);
  }

  findAllByDivisionIsNull(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.baseUrl}/divisionIsNull`);
  }

  save(staff: Staff): Observable<Staff> {
    return this.http.post<Staff>(this.baseUrl, staff);
  }

  update(staff: Staff) {
    return this.http.put<Staff>(this.baseUrl, staff);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  search(staff: {name: string, designation: string}): Observable<Staff[]> {
    return this.http.put<Staff[]>(`${this.baseUrl}/search`, staff)
      .pipe(
        delay(0)
      );
  }

}
