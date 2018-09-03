import {Account} from "./account";
import {Transaction} from "./transaction";

export interface Entry {

  id: string;
  account: Account;
  amount: string;
  operationType: string;
  transaction: Transaction
}
