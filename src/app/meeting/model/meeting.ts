import {Attendance} from "./attendance";

export interface Meeting {

  id: string;
  meetingType: string;
  meetingStatus: string;
  date: string;
  time: string;
  attendanceList: Attendance[];

}
