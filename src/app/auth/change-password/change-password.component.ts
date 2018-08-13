import {Component, OnInit, TemplateRef} from "@angular/core";
import {AuthenticationService} from "../authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;

  error: string;
  message: { type: string, msg: string };

  constructor(private authService: AuthenticationService, private router: Router,
              private route: ActivatedRoute, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'username': this.route.snapshot.params['username'],
      'oldPassword': null,
      'newPassword': null,
      'newPasswordAgain': null
    });

    this.form.get('oldPassword').valueChanges
      .pipe(
        distinctUntilChanged()
      )
      .subscribe(password => {
        this.message = null;
        this.authService.matchPasswords(this.form.get('username').value, password).subscribe(
          value => {
            console.log(value);
            this.message = {type: 'success', msg: 'Old password is correct'};
          },
          error => {
            console.log(error);
            this.message = {type: 'danger', msg: 'Old password is wrong !!!'};
          }
        );
      });
  }

  change() {
    this.authService.changePassword(this.form.get('username').value, this.form.get('newPassword').value)
      .subscribe(
      value => this.router.navigate(['']),
      error1 => this.error = 'There is something wrong in connection !!!');
  }

  cancel() {
    this.router.navigate(['']);
  }

}
