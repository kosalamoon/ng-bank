import {BoardMember} from "./board-member";
import {Subsidy} from "./subsidy";
import {Team} from "./team";

export interface Member {

  id: string;
  fullName: string;
  address: string;
  nic: string
  dob: string;
  gender: string
  telephone: string
  spouse: string;
  incomeType: string;
  subsidy: Subsidy;
  boardMember: BoardMember;
  team: Team;
}
