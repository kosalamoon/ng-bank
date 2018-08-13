import {Component, OnInit, TemplateRef} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../model/user";
import {Role} from "../../model/role";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {UserService} from "../../service/user.service";
import {RoleService} from "../../service/role.service";
import {StaffService} from "../../service/staff.service";
import {UsernameValidator} from "../../staff/validators/username.validator";
import {AuthenticationService} from "../../auth/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: "app-staff-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.css"]
})
export class UserEditComponent implements OnInit {

  form: FormGroup;

  user: User;

  authorities: Role[];

  modalRef: BsModalRef;

  constructor(private userService: UserService, private fb: FormBuilder, private staffService: StaffService,
              private roleService: RoleService, private modalService: BsModalService,
              private usernameValidator: UsernameValidator, private authService: AuthenticationService,
              private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.createUserForm();
    this.loadAuthorities();
    this.getUser(this.route.snapshot.params["id"]);

    this.username.valueChanges
      .subscribe(value => {
        if (value !== '') this.checkUsername(value);
      });
  }

  private getUser(id: string) {
    this.userService.findById(id).subscribe(user => {
      this.user = user;
      this.form.patchValue({
        "id": user.id,
        "username": user.username,
        "accountNonExpired": user.accountNonExpired,
        "accountNonLocked": user.accountNonLocked,
        "credentialsNonExpired": user.credentialsNonExpired,
        "enabled": user.enabled,
        "authorities": user.authorities,
        "staff": user.staff,
        "boardMember": user.boardMember
      });
    });
  }

  private createUserForm() {
    this.form = this.fb.group({
      "id": null,
      "username": [null, Validators.required],
      "accountNonExpired": true,
      "accountNonLocked": true,
      "credentialsNonExpired": false,
      "enabled": true,
      "authorities": [null, Validators.required],
      "staff": null,
      "boardMember": null
    });
  }

  private loadAuthorities() {
    this.roleService.findAll().subscribe(authorities => {
      this.authorities = authorities;
    });
  }

  updateUser(template: TemplateRef<any>) {
    this.validate(["id", "username", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled", "authorities", "staff", "boardMember"]);
    if (this.form.valid) this.modalRef = this.modalService.show(template);
  }

  onUpdateYes() {
    this.userService.save(this.form.value)
      .subscribe(
        value => this.router.navigate(["../"], {relativeTo: this.route})
      );
    this.modalRef.hide();
  }

  onUpdateNo() {
    this.modalRef.hide();
  }

  //<editor-fold desc="form getters">
  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get username() {
    return this.form.get("username") as FormControl;
  }

  public get authorityList() {
    return this.form.get("authorities") as FormControl;
  }

  public get staff() {
    return this.form.get("staff") as FormControl;
  }

  public get boardMember() {
    return this.form.get("boardMember") as FormControl;
  }

  public get enabled() {
    return this.form.get("enabled") as FormControl;
  }

  public get accountNonExpired() {
    return this.form.get("accountNonExpired") as FormControl;
  }

  public get accountNonLocked() {
    return this.form.get("accountNonLocked") as FormControl;
  }

  public get credentialsNonExpired() {
    return this.form.get("credentialsNonExpired") as FormControl;
  }

  //</editor-fold>

  isInvalid(control: FormControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid
    };
  }

  getRolesAsString() {
    let roles: string = "";
    (this.authorityList.value as Array<any>).forEach(value => {
      roles = roles + value.authority.slice(5, 6).toUpperCase() + value.authority.slice(6).toLowerCase() + ", ";
    });
    return roles.slice(0, roles.length - 2);
  }

  clearForm() {
    this.form.reset({
      "enabled": true,
      "accountNonExpired": true,
      "accountNonLocked": true,
      "credentialsNonExpired": false,
    });
  }

  compareRoles = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;


  private checkUsername(username: string) {
    if (username !== this.user.username)
      this.authService.checkUsername(username).subscribe(
        value => {
        },
        error1 => this.username.setErrors({"usernameExists": true})
      );
  }

  validate(controls: string[]) {
    controls.forEach(control => {
      this.form.get(control).markAsTouched({onlySelf: true})
    });
  }
}
