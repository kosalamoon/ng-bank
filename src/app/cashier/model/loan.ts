import {Account} from "../../ledger/model/account";
import {Member} from "../../person/model/member";
import {LoanType} from "./loan-type";

export interface Loan {

  id: string;
  requestedAmount: string;
  requestedDate: string;
  grantedDate: string;
  duration: string;
  remainingInstallments: string;
  nextInstallmentDate: string;
  remarks: string;
  loanType: LoanType;
  account: Account;
  member: Member

}
