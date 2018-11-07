import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {baseURL, responseType} from "../../shared/const/constants";
import {LoanType} from "../model/loan-type";
import {Observable} from "rxjs/internal/Observable";
import {Service} from "../../person/service/service";

@Injectable()
export class LoanTypeService {

  url: string = baseURL + "loanTypes";

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<LoanType[]> {
    return this.http.get<LoanType[]>(this.url);
  }

  delete(id: string) {
    return this.http.delete<string>(`${this.url}/${id}`, responseType);
  }

  findById(id: string): Observable<LoanType> {
    return this.http.get<LoanType>(`${this.url}/${id}`);
  }

  save(e: LoanType): Observable<LoanType> {
    return this.http.post<LoanType>(this.url, e);
  }

  search(e: {}, period: string, amount: string): Observable<LoanType[]> {
    let params = new HttpParams();
    if (period !== null)
      params = params.append("period", period);
    if (amount !== null)
      params = params.append("amount", amount);
    return this.http.put<LoanType[]>(`${this.url}/search`, e, {params: params});
  }

  update(e: LoanType): Observable<LoanType> {
    return this.http.put<LoanType>(this.url, e);
  }

}
