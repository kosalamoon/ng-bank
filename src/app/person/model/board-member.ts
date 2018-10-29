import {Division} from "../../area/model/division";
import {User} from "./user";
import {Member} from "./member";

export interface BoardMember {
  id: string;
  appointedDate: string;
  boardDesignation: string;
  currentStatus: string;
  member: Member;
  division: Division;
  user: User


}
