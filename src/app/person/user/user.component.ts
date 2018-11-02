import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {User} from "../model/user";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Role} from "../model/role";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {UserService} from "../service/user.service";
import {RoleService} from "../service/role.service";
import {StaffService} from "../service/staff.service";
import {UsernameValidator} from "./validators/username.validator";
import {BoardMemberService} from "../service/board-member.service";

@Component({
  selector: "app-staff-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {

  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild("staffId") staffId: ElementRef;

  form: FormGroup;
  searchForm: FormGroup;

  authorities: Role[];

  modalRef: BsModalRef;

  userType: FormControl = new FormControl(null);

  isTableLoading: boolean = false;

  errorMsg: string = null;

  constructor(private userService: UserService, private fb: FormBuilder,
              private roleService: RoleService, private modalService: BsModalService,
              private staffService: StaffService, private boardMemberService: BoardMemberService,
              private usernameValidator: UsernameValidator) {
  }


  ngOnInit() {
    this.createUserForm();
    this.createSearchForm();
    this.loadUsers();
    this.loadAuthorities();
  }

  loadUsers() {
    this.userService.findAll().subscribe(users => this.initializeTable(users));
  }

  private initializeTable(users) {
    this.isTableLoading = true;
    this.dataSource = new MatTableDataSource(users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.isTableLoading = false;
  }

  private sortingDataAccessor = (data: User, sortHeaderId: string) => {
    switch (sortHeaderId) {
      case "staffId":
        return data.staff.id;
      default:
        return data[sortHeaderId];
    }
  };
  compareRoles = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;

  compareTableColumns = (o1: any, o2: any) => o1 === o2;
  columns = ["id", "username", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled", "authorities", "action"];

  displayedColumns = ["id", "username", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled", "action"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }

  loadPerson(id: string, userType: string) {
    if (id !== "") {
      this.errorMsg = null;
      this.form.patchValue({"staff": null, "boardMember": null});
      if (userType === "staff") {
        this.staffService.findById(id).subscribe(staff => {
          if (staff.user == null)
            this.form.patchValue({"staff": staff});
          else
            this.errorMsg = "This staff member is already a user";
        }, error => this.errorMsg = "Please check again the staff Id");
        this.staffId.nativeElement.value = null;
      }
      else {
        this.boardMemberService.findById(id).subscribe(boardMember => {
          if (boardMember.user == null)
            this.form.patchValue({"boardMember": boardMember});
          else
            this.errorMsg = "This board member is already a user";
        }, error => this.errorMsg = "Please check again the board member Id");
        this.staffId.nativeElement.value = null;
      }
    }
  }

  clearPerson() {
    this.form.patchValue({"staff": null, "boardMember": null});
    this.staffId.nativeElement.value = null;
  }

  private loadAuthorities() {
    this.roleService.findAll().subscribe(authorities => {
      this.authorities = authorities;
    });
  }

  private createUserForm() {
    this.form = this.fb.group({
      "id": null,
      "username": [null, Validators.required, this.usernameValidator.checkUsername.bind(this.usernameValidator)],
      "password": [null, [Validators.required, Validators.minLength(6)]],
      "accountNonExpired": true,
      "accountNonLocked": true,
      "credentialsNonExpired": false,
      "enabled": true,
      "authorities": [null, Validators.required],
      "staff": null,
      "boardMember": null,
    });
  }

  private createSearchForm() {
    this.searchForm = this.fb.group({
      "username": null,
    });
  }

  addUser(template: TemplateRef<any>) {
    this.validate(["id", "username", "password", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled", "authorities", "staff"]);
    if (this.form.valid && this.staff.value !== null || this.boardMember.value !== null)
      this.modalRef = this.modalService.show(template);
  }

  deleteUser(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: "modal-sm"});
  }

  onPersistYes() {
    this.userService.save(this.form.value)
      .subscribe(value => this.userService.findAll(this.userType.value)
        .subscribe(users => this.initializeTable(users)));
    this.modalRef.hide();
    this.clearForm();
  }

  onPersistNo() {
    this.modalRef.hide();
  }

  onDeleteYes(id: string) {
    this.userService.delete(id)
      .subscribe(value => this.userService.findAll(this.userType.value)
        .subscribe(users => this.initializeTable(users)));
    this.modalRef.hide();
  }

  onDeleteNo() {
    this.modalRef.hide();
  }

  search() {
      this.userService.search(this.searchForm.value)
        .subscribe(users => {
            if (this.userType.value === "staff") this.initializeTable(users.filter(users => users.staff !== null));
            else this.initializeTable(users.filter(users => users.boardMember !== null));
          },
        );
  }

  clearSearch() {
    this.searchForm.reset();
    this.userType.reset();
    this.userService.findAll().subscribe(users => this.initializeTable(users));
  }

  //<editor-fold desc="form getters">
  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get username() {
    return this.form.get("username") as FormControl;
  }

  public get password() {
    return this.form.get("password") as FormControl;
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
      "is-valid": control.touched && control.valid,
    };
  }

  getRolesAsString() {
    let roles: string = "";
    if ((this.authorityList.value as Array<any>) !== null) {
      (this.authorityList.value as Array<any>).forEach(value => roles = roles + value.authority.slice(5, 6).toUpperCase() + value.authority.slice(6).toLowerCase() + ", ");
    }
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

  validate(controls: string[]) {
    controls.forEach(control => {
      this.form.get(control).markAsTouched({onlySelf: true})
    });
  }
}
