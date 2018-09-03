import {AccountType} from "./account-type";
import {Account} from "./account";

export interface SubAccountType {

  id: string;
  number: string;
  name: string;
  accountType: AccountType;
  accountSet: Account[];

}
