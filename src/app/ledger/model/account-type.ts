import {SubAccountType} from "./sub-account-type";
import {Account} from "./account";

export interface AccountType {

  id: string;
  name: string;
  accountSet: Account[];
  subAccountTypeSet: SubAccountType[];

}
