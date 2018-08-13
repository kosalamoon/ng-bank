import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {BsDatepickerModule, ModalModule} from "ngx-bootstrap";
import {StaffComponent} from "./staff.component";
import {RouterModule} from "@angular/router";
import {DesignationService} from "../service/designation.service";
import {GenderService} from "../service/gender.service";
import {RoleService} from "../service/role.service";
import {StaffService} from "../service/staff.service";
import {UserService} from "../service/user.service";
import {UsernameValidator} from "./validators/username.validator";
import {MdComponentsModule} from "../md-components/md-components.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    MdComponentsModule
  ],
  declarations: [
    StaffComponent,
  ],
  providers: [
    StaffService,
    DesignationService,
    GenderService
  ]
})
export class StaffModule { }
