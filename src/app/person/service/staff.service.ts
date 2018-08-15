import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Staff} from "../model/staff";
import {delay} from "rxjs/operators";
import {Observable} from "rxjs/internal/Observable";
import {Service} from "./service";
import {baseURL} from "../../shared/const/constants";

@Injectable()
export class StaffService implements Service<Staff> {

  url: string = baseURL + "staff";

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.url);
  }

  findById(id: string): Observable<Staff> {
    return this.http.get<Staff>(`${this.url}/${id}`);
  }

  findAllByDivisionIsNull(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.url}/divisionIsNull`);
  }

  save(staff: Staff): Observable<Staff> {
    return this.http.post<Staff>(this.url, staff);
  }

  update(staff: Staff) {
    return this.http.put<Staff>(this.url, staff);
  }

  delete(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }

  search(staff: { name: string, designation: string }): Observable<Staff[]> {
    return this.http.put<Staff[]>(`${this.url}/search`, staff)
      .pipe(
        delay(0)
      );
  }

}
