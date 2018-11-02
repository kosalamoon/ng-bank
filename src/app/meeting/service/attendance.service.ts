import {Injectable} from "@angular/core";
import {Service} from "../../person/service/service";
import {Attendance} from "../model/attendance";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";
import {baseURL, responseType} from "../../shared/const/constants";

@Injectable()
export class AttendanceService implements Service<Attendance> {

  url: string = baseURL + "attendances";

  constructor(private http: HttpClient) {}

  delete(id: string) {
    return this.http.delete<string>(`${this.url}/${id}`, responseType);
  }

  findAll(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.url);
  }

  findAllByMeetingId(id: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.url}/meeting/${id}`);
  }

  findById(id: string): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.url}/${id}`);
  }

  save(e: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(this.url, e);
  }

  saveAll(e: Attendance[]) {
    return this.http.post<Attendance[]>(`${this.url}/all`, e);
  }

  search(e: {}): Observable<Attendance[]> {
    return this.http.put<Attendance[]>(`${this.url}/search`, e);
  }

  update(e: Attendance): Observable<Attendance> {
    return this.http.put<Attendance>(this.url, e);
  }


}
