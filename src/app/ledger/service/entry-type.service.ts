import {Injectable} from "@angular/core";
import {baseURL} from "../../shared/const/constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";

@Injectable()
export class EntryTypeService {

  url: string = baseURL + "entryTypes";

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<string[]> {
    return this.http.get<string[]>(this.url);
  }
}
