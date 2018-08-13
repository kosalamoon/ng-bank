import {Staff} from "./staff";
import {BoardMember} from "./board-member";
import {Role} from "./role";

export interface User {
  id: string;
  username: string;
  password: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
  authorities: Role[];
  staff: Staff;
  boardMember: BoardMember;
}
