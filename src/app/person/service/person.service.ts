import {Injectable} from "@angular/core";
import {baseURL} from "../../shared/const/constants";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class PersonService {

  url: string = baseURL + "persons";

  constructor(private http: HttpClient) {
  }

  findDesignations() {
    return this.http.get<string[]>(`${this.url}/designations`);
  }

  findBoardDesignations() {
    return this.http.get<string[]>(`${this.url}/boardDesignations`);
  }

  findGenders() {
    return this.http.get<string[]>(`${this.url}/genders`);
  }

  findIncomeTypes() {
    return this.http.get<string[]>(`${this.url}/incomeTypes`);
  }

  findSubsidyTypes() {
    return this.http.get<string[]>(`${this.url}/subsidyTypes`);
  }

  findCurrentStatuses() {
    return this.http.get<string[]>(`${this.url}/currentStatuses`);
  }

}
