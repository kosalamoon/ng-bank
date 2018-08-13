import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MeetingComponent} from "./meeting.component";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {BsDatepickerModule, ModalModule, TimepickerModule} from "ngx-bootstrap";
import {MdComponentsModule} from "../md-components/md-components.module";
import {MeetingService} from "../service/meeting.service";
import {MeetingStatusService} from "../service/meeting-status.service";
import {MeetingTypeService} from "../service/meeting-type.service";
import { AttendanceComponent } from './attendance/attendance.component';
import {AttendanceTypeService} from "../service/attendance-type.service";
import {AttendanceService} from "../service/attendance.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    MdComponentsModule,
    TimepickerModule.forRoot()
  ],
  declarations: [MeetingComponent, AttendanceComponent],
  providers: [
    MeetingService,
    MeetingStatusService,
    MeetingTypeService,
    AttendanceTypeService,
    AttendanceService
  ]
})
export class MeetingModule { }
