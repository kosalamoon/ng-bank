import {Member} from "../../person/model/member";
import {Society} from "./society";

export interface Team {

  id: string;
  name: string;
  memberList: Member[];
  society: Society;

}
