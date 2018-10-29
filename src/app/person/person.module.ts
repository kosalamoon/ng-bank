import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {StaffService} from "./service/staff.service";
import {StaffComponent} from "./staff/staff.component";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AlertModule, BsDatepickerModule, BsDropdownModule, ModalModule} from "ngx-bootstrap";
import {SharedModule} from "../shared/shared.module";
import {UserComponent} from "./user/user.component";
import {UserEditComponent} from "./user/user-edit/user-edit.component";
import {BoardMemberService} from "./service/board-member.service";
import {RoleService} from "./service/role.service";
import {UserService} from "./service/user.service";
import {UsernameValidator} from "./user/validators/username.validator";
import {MemberComponent} from "./member/member.component";
import {BoardMemberComponent} from "./member/board-member/board-member.component";
import {MemberService} from "./service/member.service";
import {PersonService} from "./service/person.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    BsDropdownModule,
    SharedModule
  ],
  declarations: [
    StaffComponent,
    UserComponent,
    UserEditComponent,
    MemberComponent,
    BoardMemberComponent
  ],
  providers: [
    StaffService,
    BoardMemberService,
    RoleService,
    UserService,
    UsernameValidator,
    MemberService,
    PersonService,
  ]
})
export class PersonModule {
}
