import {SubAccountTypeReport} from "./sub-account-type-report";

export interface AccountTypeReport {

  name: string;
  balance: string;
  subList: SubAccountTypeReport[];

}
