import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class SubsidyTypeService {

  private baseUrl: string = "http://localhost:8080/subsidyTypes";

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<string[]>(this.baseUrl);
  }

}
