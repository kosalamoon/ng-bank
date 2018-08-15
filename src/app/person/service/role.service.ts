import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay} from "rxjs/operators";
import {Role} from "../model/role";
import {baseURL} from "../../shared/const/constants";

@Injectable()
export class RoleService {

  url: string = baseURL + "roles";

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<Role[]>(this.url)
      .pipe(
        delay(0)
      );
  }

  save(role: Role) {
    return this.http.post(`${this.url}`, role);
  }

  update(role: Role) {
    return this.http.put(this.url, role);
  }

  delete(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }

}
