import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class IncomeTypeService {
  private baseUrl: string = "http://localhost:8080/incomeTypes";

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<string[]>(this.baseUrl);
  }

}
