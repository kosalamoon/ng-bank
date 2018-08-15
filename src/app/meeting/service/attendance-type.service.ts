import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../md-components/const/constants";

@Injectable()
export class AttendanceTypeService{

  url: string = baseURL + "attendanceTypes";

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<string[]>(this.url);
  }

}
