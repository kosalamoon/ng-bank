import {SubAccountType} from "./sub-account-type";
import {AccountType} from "./account-type";

export interface Account {

  id: string;
  number: string;
  name: string;
  balance: number;
  lastUpdatedDateTime: string;
  operationType: string;
  accountType: AccountType;
  subAccountType: SubAccountType;


}
