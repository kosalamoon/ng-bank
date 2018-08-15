import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../shared/const/constants";

@Injectable()
export class SubsidyTypeService {

  private url: string = baseURL + "subsidyTypes";

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<string[]>(this.url);
  }

}
