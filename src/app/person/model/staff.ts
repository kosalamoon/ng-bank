import {Division} from "../../area/model/division";
import {User} from "./user";

export interface Staff {
  id: string;
  name: string;
  address: string;
  dob: string;
  nic: string;
  mobile: string;
  gender: string;
  designation: string;
  division: Division;
  user: User;

}
