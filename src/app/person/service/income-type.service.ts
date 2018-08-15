import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../shared/const/constants";

@Injectable()
export class IncomeTypeService {
  private url: string = baseURL + "incomeTypes";

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<string[]>(this.url);
  }

}
