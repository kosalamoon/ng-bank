import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay} from "rxjs/operators";
import {User} from "../model/user";

@Injectable()
export class UserService {

  baseUrl: string = "http://localhost:8080/users";

  constructor(private http: HttpClient) {
  }

  findAll(userType: string = null) {
    switch (userType){
      case 'staff': return this.findAllByHavingStaff();
      case 'boardMember': return this.findAllByHavingBoardMember();
      default: return this.http.get<User[]>(this.baseUrl).pipe(delay(0));
    }
  }

  findById(id: string) {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  findAllByHavingStaff() {
    return this.http.get<User[]>(`${this.baseUrl}/staff`)
      .pipe(
        delay(0)
      );
  }

  findAllByHavingBoardMember() {
    return this.http.get<User[]>(`${this.baseUrl}/boardMember`)
      .pipe(
        delay(0)
      );
  }


  save(user: User) {
    return this.http.post<User>(`${this.baseUrl}`, user);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  search(user: User) {
    return this.http.put<User[]>(`${this.baseUrl}/search`, user)
      .pipe(
        delay(0)
      );
  }

}
