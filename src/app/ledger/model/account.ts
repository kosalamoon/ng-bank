import {SubAccountType} from "./sub-account-type";
import {AccountType} from "./account-type";
import {Team} from "../../area/model/team";

export interface Account {

  id: string;
  number: string;
  name: string;
  balance: number;
  lastUpdatedDateTime: string;
  operationType: string;
  accountType: AccountType;
  subAccountType: SubAccountType;
  team: Team


}
