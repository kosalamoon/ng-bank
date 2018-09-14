import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../shared/const/constants";
import {LoanType} from "../model/loan-type";
import {Observable} from "rxjs/internal/Observable";

@Injectable()
export class LoanTypeService {

  url: string = baseURL + "loanTypes";

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<LoanType[]> {
    return this.http.get<LoanType[]>(this.url);
  }

}
