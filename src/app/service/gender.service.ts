import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class GenderService {

  baseUrl: string = "http://localhost:8080/genders";

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<string[]>(this.baseUrl);
  }

}
