import {Injectable} from "@angular/core";
import {baseURL} from "../../shared/const/constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";

@Injectable()
export class OperationTypeService {

  url: string = baseURL + "operationTypes";

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<string[]> {
    return this.http.get<string[]>(this.url);
  }
}
