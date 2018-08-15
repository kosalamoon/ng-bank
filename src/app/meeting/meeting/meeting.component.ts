import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {MatPaginator, MatSelectChange, MatSort, MatTableDataSource} from "@angular/material";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Meeting} from "../model/meeting";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MeetingService} from "../service/meeting.service";
import {MeetingStatusService} from "../service/meeting-status.service";
import {MeetingTypeService} from "../service/meeting-type.service";
import {AttendanceService} from "../service/attendance.service";
import {Attendance} from "../model/attendance";
import {date, time} from "../../md-components/regex/regex";

@Component({
  selector: "app-meeting",
  templateUrl: "./meeting.component.html",
  styleUrls: ["./meeting.component.css"]
})
export class MeetingComponent implements OnInit {

  dataSource: MatTableDataSource<Meeting>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  searchForm: FormGroup;

  meetingStatusList: string[];
  meetingTypeList: string[];
  attendanceList: Attendance[];

  modalRef: BsModalRef;

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, private modalService: BsModalService,
    private meetingService: MeetingService, private meetingStatusService: MeetingStatusService,
    private meetingTypeService: MeetingTypeService, private attendanceService: AttendanceService
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.createSearchForm();
    this.meetingService.findAll().subscribe(value => this.initializeTable(value));
    this.loadMeetingStatuses();
    this.loadMeetingTypes();
  }

  private createForm() {
    this.form = this.fb.group({
      "id": null,
      "date": [null, [Validators.required, Validators.pattern(date)]],
      "time": [null, [Validators.required, Validators.pattern(time)]],
      "meetingStatus": [null, Validators.required],
      "meetingType": [null, Validators.required]
    });
  }

  private createSearchForm() {
    this.searchForm = this.fb.group({
      "date": null,
      "meetingStatus": null,
      "meetingType": null
    });
  }

  private initializeTable(meetings: Meeting[]) {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource(meetings);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.isLoading = false;
  }

  compareTableColumns = (o1: any, o2: any) => o1 === o2;

  sortingDataAccessor = (data: Meeting, sortHeaderId: string) => {
    switch (sortHeaderId) {
      default:
        return data[sortHeaderId];
    }
  };

  private loadMeetingStatuses() {
    this.meetingStatusService.findAll().subscribe(value => this.meetingStatusList = value);
  }

  private loadMeetingTypes() {
    this.meetingTypeService.findAll().subscribe(value => this.meetingTypeList = value);
  }

  fillForm(meeting: Meeting) {
    this.clearForm();
    this.form.patchValue({
      "id": meeting.id,
      "date": meeting.date,
      "time": this.convertStringToTime(meeting.time),
      "meetingStatus": meeting.meetingStatus,
      "meetingType": meeting.meetingType
    });
  }

  clearForm() {
    this.form.reset();
  }

  columns = ["id", "date", "time", "meetingStatus", "meetingType", "action" , "attendance"];
  displayedColumns = ["id", "date", "time", "meetingStatus", "meetingType", "action", "attendance"];

  addColumn(event: MatSelectChange) {
    this.displayedColumns = event.value;
  }


  addMeeting(template: TemplateRef<any>) {
    this.form.patchValue({
      "date": this.convertDateToString(this.date.value),
      "time": this.convertTimeToString(this.time.value)
    });
    this.validate(["id", "date", "time", "meetingStatus", "meetingType"]);
      if (this.form.valid)
        this.modalRef = this.modalService.show(template);
  }

  deleteMeeting(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: "modal-sm"});
  }

  onDeleteYes(id: string) {
    this.meetingService.delete(id).subscribe(
      value => this.meetingService.findAll().subscribe(meetingList => this.initializeTable(meetingList))
    );
    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
  }

  onPersistYes() {
    console.log(this.form.value);
    this.meetingService.save(this.form.value).subscribe(
      value => {
        this.clearForm();
        this.meetingService.findAll().subscribe(meetingList => this.initializeTable(meetingList));
        this.closeModal();
      });
  }

  clearSearch() {
    this.searchForm.reset();
    this.meetingService.findAll().subscribe(meetingList => this.initializeTable(meetingList));
  }

  search() {
    setTimeout(() => {
      console.log(this.searchForm.value);
      this.searchForm.patchValue({
        date: this.convertDateToString(this.searchForm.get("date").value)
      });
      this.meetingService.search(this.searchForm.value).subscribe(meetingList => this.initializeTable(meetingList));
    }, 500);
  }

  loadAttendance(id: string, template: TemplateRef<any>) {
    this.attendanceService.findAllByMeetingId(id).subscribe(value => {
      this.attendanceList = value;
      this.modalRef = this.modalService.show(template);

    });
  }

  convertDateToString(value): string {
    if (value instanceof Date) {
      let fullDate: string;
      fullDate = value.getFullYear().toString() + "-";
      if (value.getMonth() < 9) {
        fullDate += "0" + (value.getMonth() + 1).toString() + "-";
      } else {
        fullDate += (value.getMonth() + 1).toString() + "-";
      }
      if (value.getDate() < 10) {
        fullDate += "0" + (value.getDate()).toString();
      } else {
        fullDate += value.getDate().toString();
      }
      return fullDate;
    }
    else
      return value;
  }

  convertTimeToString(value): string {
    if (value instanceof Date) {
      let time: string;
      time = value.getHours() < 10 ? "0" + value.getHours() : "" + value.getHours();
      time += value.getMinutes() < 10 ? ":0" + value.getMinutes() : ":" + value.getMinutes();
      return time;
    }
    else
      return value;
  }

  convertStringToTime(value: string): Date {
    let date: Date = new Date();
    date.setHours(Number.parseInt(value.slice(0, 2)));
    date.setMinutes(Number.parseInt(value.slice(3)));
    return date;
  }

  //<editor-fold desc="form getters">
  public get id() {
    return this.form.get("id") as FormControl;
  }

  public get date() {
    return this.form.get("date") as FormControl;
  }

  public get time() {
    return this.form.get("time") as FormControl;
  }

  public get meetingStatus() {
    return this.form.get("meetingStatus") as FormControl;
  }

  public get meetingType() {
    return this.form.get("meetingType") as FormControl;
  }

  //</editor-fold>

  isInvalid(control: FormControl) {
    return {
      "is-invalid": control.touched && control.invalid,
      "is-valid": control.touched && control.valid
    };
  }

  tableRowStyle(attendanceType: string) {
    return {
      "table-danger": attendanceType === 'Absent',
      "table-success": attendanceType === 'Present'
    };
  }

  compareDropdown = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;

  validate(controls: string[]) {
    controls.forEach(control => {
      this.form.get(control).markAsTouched({onlySelf: true})
    });
  }

}
