import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../md-components/const/constants";

@Injectable()
export class SubsidyTypeService {

  private url: string = baseURL + "subsidyTypes";

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<string[]>(this.url);
  }

}
