import {Account} from "../../ledger/model/account";
import {Member} from "../../person/model/member";
import {SavingType} from "./saving-type";

export interface Savings {
  id: string;
  openedDate: string;
  savingStatus: string;
  savingType: SavingType;
  account: Account;
  member: Member;
}
