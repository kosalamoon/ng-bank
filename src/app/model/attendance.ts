import {Meeting} from "./meeting";
import {BoardMember} from "./board-member";

export interface Attendance {

  id: string;
  attendanceType: string;
  meeting: Meeting;
  boardMember: BoardMember;
  remarks: string;

}
