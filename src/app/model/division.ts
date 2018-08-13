import {Staff} from "./staff";
import {BoardMember} from "./board-member";
import {Society} from "./society";

export interface Division {
  id: string;
  name: string;
  societyList: Society[];
  staff: Staff;
  boardMember: BoardMember
}
