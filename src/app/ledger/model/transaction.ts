import {User} from "../../person/model/user";
import {Entry} from "./entry";

export interface Transaction {

  id: string;
  dateTime: string;
  entryType: string;
  user: User;
  entryList: Entry[];

}
