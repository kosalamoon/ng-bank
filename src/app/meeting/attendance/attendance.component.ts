import {Component, OnInit, TemplateRef} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {BoardMemberService} from "../../person/service/board-member.service";
import {MeetingService} from "../service/meeting.service";
import {AttendanceTypeService} from "../service/attendance-type.service";
import {AttendanceService} from "../service/attendance.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/internal/Observable";
import {BoardMember} from "../../person/model/board-member";
import {Meeting} from "../model/meeting";
import {forkJoin} from "rxjs/internal/observable/forkJoin";
import {Attendance} from "../model/attendance";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.css"]
})
export class AttendanceComponent implements OnInit {

  form: FormGroup;

  modalRef: BsModalRef;

  attendanceTypeList: String[] = [];

  constructor(private boardMemberService: BoardMemberService, private meetingService: MeetingService,
              private attendanceService: AttendanceService, private attendanceTypeService: AttendanceTypeService,
              private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private modalService: BsModalService) {
  }

  boardMembers$: Observable<BoardMember[]>;
  attendanceTypes$: Observable<string[]>;
  meeting$: Observable<Meeting>;
  attendances$: Observable<Attendance[]>;


  ngOnInit() {
    this.createForm();
    this.loadBoardMembers();
    this.loadAttendanceTypes();
    this.loadMeeting();

    if (this.route.snapshot.queryParams.isNew === "true")
      this.createAttendances();
    else {
      this.loadAttendances(this.route.snapshot.queryParams.meetingId);
      this.loadExisting();
    }
  }

  createForm() {
    this.form = this.fb.group({
      "attendanceList": this.fb.array([])
    });
  }

  loadMeeting() {
    this.meeting$ = this.meetingService.findById(this.route.snapshot.queryParams.meetingId);
  }

  loadAttendances(id: string) {
    this.attendances$ = this.attendanceService.findAllByMeetingId(id);
  }

  loadBoardMembers() {
    this.boardMembers$ = this.boardMemberService.findAll();
  }

  loadAttendanceTypes() {
    this.attendanceTypes$ = this.attendanceTypeService.findAll();
  }

  createAttendances() {
    forkJoin(this.attendanceTypes$, this.meeting$, this.boardMembers$).subscribe(value => {
      this.attendanceTypeList = value[0];
      (value[2] as Array<BoardMember>).forEach(value1 => {
        this.attendanceList.push(this.fb.group({
          "id": null,
          "meeting": value[1],
          "boardMember": value1,
          "attendanceType": value[0][0],
          "remarks": null
        }));
      });
    });
  }

  loadExisting() {
    forkJoin(this.attendanceTypes$, this.attendances$).subscribe(value => {
      this.attendanceTypeList = value[0];
      value[1].forEach(attendance => {
        this.attendanceList.push(this.fb.group({
          "id": attendance.id,
          "meeting": attendance.meeting,
          "boardMember": attendance.boardMember,
          "attendanceType": attendance.attendanceType,
          "remarks": attendance.remarks
        }));
      });
    });
  }

  get attendanceList() {
    return (this.form.get("attendanceList") as FormArray);
  }

  markAllAsPresent() {
    this.attendanceList.controls.forEach((value: FormGroup) => {
      value.patchValue({"attendanceType": this.attendanceTypeList[0]});
    });
  }

  markAllAsAbsent() {
    this.attendanceList.controls.forEach((value: FormGroup) => {
      value.patchValue({"attendanceType": this.attendanceTypeList[1]});
    });
  }

  addAttendance(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onPersistYes() {
    this.attendanceService.saveAll(this.attendanceList.value).subscribe(value => {
      this.closeModal();
      this.router.navigate(["../meeting"], {relativeTo: this.route})
    });
  }

  closeModal() {
    this.modalRef.hide();
  }
}




