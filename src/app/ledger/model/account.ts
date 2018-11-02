import {SubAccountType} from "./sub-account-type";
import {AccountType} from "./account-type";
import {Team} from "../../area/model/team";
import {Member} from "../../person/model/member";
import {Savings} from "../../savings/model/savings";
import {Loan} from "../../loan/model/loan";

export interface Account {

  id: string;
  number: string;
  name: string;
  balance: string;
  lastUpdatedDateTime: string;
  operationType: string;
  accountType: AccountType;
  subAccountType: SubAccountType;
  team: Team
  shareHolder: Member;
  savings: Savings;
  loan: Loan;


}
