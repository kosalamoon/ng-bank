import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MemberComponent} from "./member.component";
import {MemberService} from "../service/member.service";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {BsDatepickerModule, ModalModule} from "ngx-bootstrap";
import {MdComponentsModule} from "../md-components/md-components.module";
import {IncomeTypeService} from "../service/income-type.service";
import {SubsidyTypeService} from "../service/subsidy-type.service";
import { BoardMemberComponent } from './board-member/board-member.component';

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
    MemberComponent,
    BoardMemberComponent
  ],
  providers: [
    MemberService,
    IncomeTypeService,
    SubsidyTypeService
  ]
})
export class MemberModule { }
