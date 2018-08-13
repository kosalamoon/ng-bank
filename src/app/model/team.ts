import {Member} from "./member";
import {Society} from "./society";

export interface Team {

  id: string;
  name: string;
  memberSet: Member[];
  society: Society;

}
