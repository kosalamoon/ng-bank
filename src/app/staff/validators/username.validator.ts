import {AbstractControl} from "@angular/forms";
import {ValidationErrors} from "@angular/forms/src/directives/validators";
import {Observable} from "rxjs/index";
import {AuthenticationService} from "../../auth/authentication.service";
import {Injectable} from "@angular/core";

@Injectable()
export class UsernameValidator{

  constructor(private authService: AuthenticationService) {
  }

  checkUsername(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      this.authService.checkUsername(control.value).subscribe(value => {
        resolve(null);
      }, error1 => {
        resolve({"usernameExists": true});
      })
    })
  }

}
