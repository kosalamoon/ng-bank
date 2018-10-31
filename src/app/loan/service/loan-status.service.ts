import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../shared/const/constants";
import {Observable} from "rxjs/internal/Observable";

@Injectable()
export class LoanStatusService {

  url: string = baseURL + "loanStatuses";

  constructor(private http: HttpClient) {
  }


  findAll(): Observable<string[]> {
    return this.http.get<string[]>(this.url);
  }
}
