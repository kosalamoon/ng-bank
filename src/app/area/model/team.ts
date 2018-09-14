import {Member} from "../../person/model/member";
import {Society} from "./society";
import {Account} from "../../ledger/model/account";

export interface Team {

  id: string;
  name: string;
  memberList: Member[];
  society: Society;
  account: Account;

}
