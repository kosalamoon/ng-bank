import {SubAccountType} from "./sub-account-type";

export interface AccountType {

  id: string;
  name: string;
  accountSet: Account[];
  subAccountTypeSet: SubAccountType[];

}
