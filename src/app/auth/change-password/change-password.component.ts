import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "../authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;

  error: string;
  message: { type: string, msg: string };

  constructor(private authService: AuthenticationService, private router: Router,
              private route: ActivatedRoute, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
    this.addConfirmValidation();
  }

  oldPasswordValidation = (control: FormControl) =>
    new Promise(resolve => this.authService.matchPasswords(this.username.value, control.value)
      .subscribe(value => resolve(null), error1 => resolve({"oldPasswordIsWrong": true})),
    );

  private createForm() {
    this.form = this.formBuilder.group({
      'username': this.route.snapshot.params['username'],
      'oldPassword': [null, Validators.required, this.oldPasswordValidation.bind(this)],
      'newPassword': [null, Validators.required],
      'newPasswordAgain': [null, Validators.required],
    });
  }

  addConfirmValidation() {
    let confirmValidation = (control: FormControl) => control.value !== null ? control.value !== this.newPassword.value ? {"confirmationIsWrong": true} : null : null;
    this.newPasswordAgain.setValidators([Validators.required.bind(this), confirmValidation.bind(this)]);
  }

  change() {
    if (this.form.valid)
      this.authService.changePassword(this.username.value, this.newPassword.value)
      .subscribe(
        value => this.router.navigate(['']),
        error1 => this.error = 'There is something wrong in connection !!!');
  }

  cancel() {
    this.router.navigate(['']);
  }

  //<editor-fold desc="Form getters">
  public get username() {
    return this.form.get("username");
  }

  public get oldPassword() {
    return this.form.get("oldPassword");
  }

  public get newPassword() {
    return this.form.get("newPassword");
  }

  public get newPasswordAgain() {
    return this.form.get("newPasswordAgain");
  }

  //</editor-fold>

  isInvalid(control: AbstractControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid,
    };
  }

  requiredValidation(control: AbstractControl) {
    return control.hasError("required") && control.touched;
  }

}
