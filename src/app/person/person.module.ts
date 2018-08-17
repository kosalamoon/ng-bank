import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {StaffService} from "./service/staff.service";
import {DesignationService} from "./service/designation.service";
import {GenderService} from "./service/gender.service";
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
import {IncomeTypeService} from "./service/income-type.service";
import {SubsidyTypeService} from "./service/subsidy-type.service";

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
    DesignationService,
    GenderService,
    BoardMemberService,
    RoleService,
    UserService,
    UsernameValidator,
    MemberService,
    IncomeTypeService,
    SubsidyTypeService
  ]
})
export class PersonModule {
}
