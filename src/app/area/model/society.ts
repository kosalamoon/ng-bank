import {Team} from "./team";
import {Division} from "./division";

export interface Society {

  id: string;
  name: string;
  teamList: Team[];
  division: Division;
}
