import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay} from "rxjs/operators";
import {Role} from "../model/role";

@Injectable()
export class RoleService {

  baseUrl: string = "http://localhost:8080/roles";

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<Role[]>(this.baseUrl)
      .pipe(
        delay(0)
      );
  }

  save(role: Role) {
    return this.http.post(`${this.baseUrl}`, role);
  }

  update(role: Role) {
    return this.http.put(this.baseUrl, role);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
