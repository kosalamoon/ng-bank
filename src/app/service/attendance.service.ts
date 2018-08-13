import {Injectable} from "@angular/core";
import {Service} from "./service";
import {Attendance} from "../model/attendance";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AttendanceService implements Service<Attendance> {

  baseUrl: string = "http://localhost:8080/attendances";

  constructor(private http: HttpClient) {}

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  findAll(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.baseUrl);
  }

  findAllByMeetingId(id: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/meeting/${id}`);
  }

  findById(id: string): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.baseUrl}/${id}`);
  }

  save(e: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(this.baseUrl, e);
  }

  saveAll(e: Attendance[]) {
    return this.http.post<Attendance[]>(`${this.baseUrl}/all`, e);
  }

  search(e: {}): Observable<Attendance[]> {
    return this.http.put<Attendance[]>(`${this.baseUrl}/search`, e);
  }

  update(e: Attendance): Observable<Attendance> {
    return this.http.put<Attendance>(this.baseUrl, e);
  }


}
