import {Staff} from "../../person/model/staff";
import {BoardMember} from "../../person/model/board-member";
import {Society} from "./society";

export interface Division {
  id: string;
  name: string;
  societySet: Society[];
  staff: Staff;
  boardMember: BoardMember
}
