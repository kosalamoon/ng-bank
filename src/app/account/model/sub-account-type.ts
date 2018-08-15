import {AccountType} from "./account-type";

export interface SubAccountType {

  id: string;
  number: string;
  name: string;
  accountType: AccountType;
  accountSet: Account[];

}
