import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay} from "rxjs/operators";
import {User} from "../model/user";
import {baseURL, responseType} from "../../shared/const/constants";

@Injectable()
export class UserService {

  url: string = baseURL + "users";

  constructor(private http: HttpClient) {
  }

  findAll(userType: string = null) {
    switch (userType) {
      case "staff":
        return this.findAllByHavingStaff();
      case "boardMember":
        return this.findAllByHavingBoardMember();
      default:
        return this.http.get<User[]>(this.url).pipe(delay(0));
    }
  }

  findById(id: string) {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  findAllByHavingStaff() {
    return this.http.get<User[]>(`${this.url}/staff`)
      .pipe(
        delay(0)
      );
  }

  findAllByHavingBoardMember() {
    return this.http.get<User[]>(`${this.url}/boardMember`)
      .pipe(
        delay(0)
      );
  }


  save(user: User) {
    return this.http.post<User>(`${this.url}`, user);
  }

  delete(id: string) {
    return this.http.delete<string>(`${this.url}/${id}`, responseType);
  }

  search(user: User) {
    return this.http.put<User[]>(`${this.url}/search`, user)
      .pipe(
        delay(0)
      );
  }

}
