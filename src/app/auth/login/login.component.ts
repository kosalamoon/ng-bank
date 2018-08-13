import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthenticationService} from "../authentication.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {

  invalidLogin: boolean = false;
  message: string;
  remainingAttempts: number = 3;
  remainingAttemptMsg: string;

  @ViewChild('username') username: ElementRef;

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  logIn(form: NgForm) {
    this.authService.logIn(form.value.username, form.value.password).subscribe(
      (value) => this.router.navigate(["/home"]),
      (error: HttpErrorResponse) => {
        this.invalidLogin = true;
        this.message = error.error.message;
        if (this.message === "Your account credentials is expired!!!")
          setTimeout(() => {
            this.router.navigate(["/changePassword", form.value.username]);
          }, 2000);
        else if (this.message === "Your password is wrong!!!") {
          if (this.remainingAttempts === 1) {
            this.authService.lockAccount(form.value.username).subscribe(response => {
              this.remainingAttemptMsg = null;
              this.message = response.message;
              this.remainingAttempts = 3;
              return;
            });
          }
          this.remainingAttempts -= 1;
          this.remainingAttemptMsg = `You have only ${this.remainingAttempts} attempts left`;
        }
      }
    );
  }

  ngOnInit() {
    this.username.nativeElement.focus();
  }

}
