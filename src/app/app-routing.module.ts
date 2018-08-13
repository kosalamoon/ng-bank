import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";

import {LoginComponent} from "./auth/login/login.component";
import {HomeComponent} from "./core/home/home.component";
import {ChangePasswordComponent} from "./auth/change-password/change-password.component";
import {MemberComponent} from "./member/member.component";
import {UserComponent} from "./user/user.component";
import {UserEditComponent} from "./user/user-edit/user-edit.component";
import {StaffComponent} from "./staff/staff.component";
import {MainWindowComponent} from "./core/main-window/main-window.component";
import {DivisionComponent} from "./area/division/division.component";
import {SocietyComponent} from "./area/society/society.component";
import {TeamComponent} from "./area/team/team.component";
import {MeetingComponent} from "./meeting/meeting.component";
import {AttendanceComponent} from "./meeting/attendance/attendance.component";
import {BoardMemberComponent} from "./member/board-member/board-member.component";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, children: [
      {path: '', component: MainWindowComponent},
      {path: 'staff', component: StaffComponent},
      {path: 'member', component: MemberComponent},
      {path: 'boardMember', component: BoardMemberComponent},
      {path: 'user/:id', component: UserEditComponent},
      {path: 'user', component: UserComponent},
      {path: 'division', component: DivisionComponent},
      {path: 'society', component: SocietyComponent},
      {path: 'team', component: TeamComponent},
      {path: 'meeting', component: MeetingComponent},
      {path: 'attendance', component: AttendanceComponent}
    ]},
  {path: 'changePassword/:username', component: ChangePasswordComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
