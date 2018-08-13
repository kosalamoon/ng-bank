import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {UserComponent} from "./user.component";
import {UserEditComponent} from "./user-edit/user-edit.component";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AlertModule, ModalModule} from "ngx-bootstrap";
import {MdComponentsModule} from "../md-components/md-components.module";
import {BoardMemberService} from "../service/board-member.service";
import {RoleService} from "../service/role.service";
import {UserService} from "../service/user.service";
import {UsernameValidator} from "../staff/validators/username.validator";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    ReactiveFormsModule,
    MdComponentsModule
  ],
  declarations: [
    UserComponent,
    UserEditComponent
  ],
  providers: [
    BoardMemberService,
    RoleService,
    UserService,
    UsernameValidator
  ]
})
export class UserModule {
}
