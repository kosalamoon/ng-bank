import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Service} from "../../person/service/service";
import {Loan} from "../model/loan";
import {Observable} from "rxjs/internal/Observable";
import {baseURL} from "../../shared/const/constants";
import {LoanStatusRequest} from "../model/loan-status-request";
import {LoanStatusResponse} from "../model/loan-status-response";

@Injectable()
export class LoanService implements Service<Loan> {

  url: string = baseURL + "loans";

  constructor(private http: HttpClient) {
  }

  delete(id: string) {
  }

  findAll(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.url);
  }

  findAllByMemberId(id: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.url}/members/${id}`);
  }

  findById(id: string): Observable<Loan> {
    return this.http.get<Loan>(`${this.url}/${id}`);
  }

  nextInstallmentAmount(id: string) {

  }

  calculateInterestAndFine(request: LoanStatusRequest): Observable<LoanStatusResponse> {
    return this.http.put<LoanStatusResponse>(`${this.url}/calcInterestAndFine`, request);
  }

  payInstallment(id: string): Observable<Loan> {
    return this.http.put<Loan>(`${this.url}/pay/${id}`, null);
  }

  save(e: Loan): Observable<Loan> {
    return this.http.post<Loan>(this.url, e);
  }

  search(e: {}): Observable<Loan[]> {
    return this.http.put<Loan[]>(`${this.url}/search`, e);
  }

  update(e: Loan): Observable<Loan> {
    return this.http.put<Loan>(this.url, e);
  }

}
