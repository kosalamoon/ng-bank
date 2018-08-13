import {Division} from "./division";
import {User} from "./user";
import {Member} from "./member";

export interface BoardMember {
  id: string;
  appointedDate: string;
  boardDesignation: string;
  member: Member;
  division: Division;
  user: User


}
