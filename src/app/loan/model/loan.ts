import {Account} from "../../ledger/model/account";
import {Member} from "../../person/model/member";
import {LoanType} from "./loan-type";

export interface Loan {

  id: string;
  requestedAmount: string;
  requestedDate: string;
  grantedDate: string;
  equatedMonthlyValue: string;
  duration: string;
  remarks: string;
  isApproved: boolean;
  loanType: LoanType;
  account: Account;
  member: Member;

}
