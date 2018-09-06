import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {baseURL} from "../../shared/const/constants";
import {Service} from "../../person/service/service";
import {SavingType} from "../model/saving-type";
import {Observable} from "../../../../node_modules/rxjs";

@Injectable()
export class SavingTypeService implements Service<SavingType> {

  url: string = baseURL + "savingTypes";

  constructor(private http: HttpClient) {
  }

  delete(id: string) {
    return this.http.delete(`${baseURL}/${id}`);
  }

  findAll(): Observable<SavingType[]> {
    return this.http.get<SavingType[]>(this.url);
  }

  findById(id: string): Observable<SavingType> {
    return this.http.get<SavingType>(`${this.url}/${id}`);
  }

  save(e: SavingType): Observable<SavingType> {
    return this.http.post<SavingType>(this.url, e);
  }

  search(e: {}): Observable<SavingType[]> {
    return this.http.put<SavingType[]>(`${this.url}/search`, e);
  }

  update(e: SavingType): Observable<SavingType> {
    return this.http.put<SavingType>(this.url, e);
  }


}
