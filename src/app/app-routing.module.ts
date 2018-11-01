import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";

import {LoginComponent} from "./auth/login/login.component";
import {HomeComponent} from "./core/home/home.component";
import {ChangePasswordComponent} from "./auth/change-password/change-password.component";
import {MemberComponent} from "./person/member/member.component";
import {UserComponent} from "./person/user/user.component";
import {UserEditComponent} from "./person/user/user-edit/user-edit.component";
import {StaffComponent} from "./person/staff/staff.component";
import {MainWindowComponent} from "./core/main-window/main-window.component";
import {DivisionComponent} from "./area/division/division.component";
import {SocietyComponent} from "./area/society/society.component";
import {TeamComponent} from "./area/team/team.component";
import {MeetingComponent} from "./meeting/meeting/meeting.component";
import {AttendanceComponent} from "./meeting/attendance/attendance.component";
import {BoardMemberComponent} from "./person/member/board-member/board-member.component";
import {AccountComponent} from "./ledger/account/account.component";
import {SharesAccountComponent} from "./cashier/shares-account/shares-account.component";
import {TeamAccountComponent} from "./cashier/team-account/team-account.component";
import {DepositComponent} from "./cashier/deposit/deposit.component";
import {WithdrawComponent} from "./cashier/withdraw/withdraw.component";
import {LoanInstallmentComponent} from "./cashier/loan-installment/loan-installment.component";
import {SavingsComponent} from "./savings/savings/savings.component";
import {LoanApproveComponent} from "./loan/loan-approve/loan-approve.component";
import {LoanDetailsComponent} from "./loan/loan-details/loan-details.component";
import {LoanRequestComponent} from "./loan/loan-request/loan-request.component";

const routes: Routes = [
  {path: "", redirectTo: "login", pathMatch: "full"},
  {path: "login", component: LoginComponent},
  {
    path: "home", component: HomeComponent, children: [
      {path: "", component: MainWindowComponent},
      {path: "staff", component: StaffComponent},
      {path: "member", component: MemberComponent},
      {path: "boardMember", component: BoardMemberComponent},
      {path: "user/:id", component: UserEditComponent},
      {path: "user", component: UserComponent},
      {path: "division", component: DivisionComponent},
      {path: "society", component: SocietyComponent},
      {path: "team", component: TeamComponent},
      {path: "meeting", component: MeetingComponent},
      {path: "attendance", component: AttendanceComponent},
      {path: "account", component: AccountComponent},
      {path: "share-account", component: SharesAccountComponent},
      {path: "team-account", component: TeamAccountComponent},
      {path: "deposit", component: DepositComponent},
      {path: "withdraw", component: WithdrawComponent},
      {path: "loan-pay", component: LoanInstallmentComponent},
      {path: "savings", component: SavingsComponent},
      {path: "loan-approve", component: LoanApproveComponent},
      {path: "loan-details", component: LoanDetailsComponent},
      {path: "loan-request", component: LoanRequestComponent},
    ]
  },
  {path: "changePassword/:username", component: ChangePasswordComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
