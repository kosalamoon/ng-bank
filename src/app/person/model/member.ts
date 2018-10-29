import {BoardMember} from "./board-member";
import {Subsidy} from "./subsidy";
import {Team} from "../../area/model/team";
import {Account} from "../../ledger/model/account";
import {Savings} from "../../savings/model/savings";
import {Loan} from "../../loan/model/loan";

export interface Member {

  id: string;
  fullName: string;
  address: string;
  nic: string
  dob: string;
  gender: string
  telephone: string
  spouse: string;
  incomeType: string;
  subsidy: Subsidy;
  boardMember: BoardMember;
  team: Team;
  shareAccount: Account;
  savingsList: Savings[];
  loanList: Loan[];
}
