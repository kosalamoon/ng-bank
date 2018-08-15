import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";


@Injectable()
export class MeetingTypeService {

  baseUrl: string = "http://localhost:8080/meetingTypes";

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<string[]>(this.baseUrl);
  }

}
