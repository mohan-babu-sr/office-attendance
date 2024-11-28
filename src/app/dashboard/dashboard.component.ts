import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DbCallService } from '../core/db-call.service';
import { CommonPopupComponent } from '../common-popup/common-popup.component';
import * as moment from 'moment';
import { CommonWarningComponent } from '../common-warning/common-warning.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentMonth = 'MONTH YEAR';
  workingDays = 0;
  daysInOffice = 0;
  daysInHome = 0;
  remainingDaysOffice = 0;
  remainingDaysHome = 0;
  listParams = {
    'limit': 15,
    'offset': 0,
    'place': null,
    'sortBy': 'Date:desc'
  }
  currentMonthYear = '';
  listOfDays: any;
  catelogList = ['places'];
  catelogs: any = {};


  constructor(private dialog: MatDialog, private dbCallService: DbCallService) { }

  ngOnInit(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;  // getMonth() returns 0-11, so add 1 to make it 1-12
    const currentYear = currentDate.getFullYear();    // getFullYear() returns the full year (e.g., 2024)

    this.getCurrentMonth();
    this.getCatelogs(this.catelogList);
    this.getTotalWorkingDays(currentMonth, currentYear);
    if(this.catelogs){
      this.getTotalDaysInOffice();
      this.getTotalDaysInHome();
    }
    this.getListOfDays(this.listParams);
  }

  getListOfDays(listParams: any) {
    listParams.monthYear = this.currentMonthYear;
    this.listParams = { ...listParams };

    this.dbCallService.getData(this.listParams).subscribe((response) => {
      if (response && Array.isArray(response)) {
        this.listOfDays = response.map((element: any) => {
          return {
            ...element,
            Date: moment(element.Date).format('D MMMM YYYY (dddd)'), // Format the Date field
          };
        });
      }
    });
  }

  getTotalWorkingDays(month: number, year: number) {
    // Get the first day and last day of the given month
    const startDate = new Date(year, month - 1, 1);  // month is 0-indexed, so we subtract 1
    const endDate = new Date(year, month, 0);        // The last day of the month

    let workingDays = 0;

    // Loop through each day of the month
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      // Check if the current day is not a Saturday (6) or Sunday (0)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        workingDays++;  // Increment working days
      }
    }

    this.workingDays = workingDays;
    this.remainingDaysHome = this.workingDays - 12;
  }

  getCurrentMonth() {
    const currentMonthYear: string = new Date().toLocaleString('default', { year: 'numeric', month: 'long' });
    this.currentMonth = currentMonthYear;
    this.currentMonthYear = currentMonthYear.replace(' ', '').toLocaleLowerCase();
  }

  getTotalDaysInOffice() {
    console.log( this.catelogs['places']);
    let data = { monthYear: this.currentMonthYear, place: this.catelogs ? this.catelogs.places : null };
    this.dbCallService.getData(data).subscribe((response) => {
      this.daysInOffice = response.length;
      this.remainingDaysOffice = 12 - this.daysInOffice;
    });
  }

  getTotalDaysInHome() {
    let data = { monthYear: this.currentMonthYear, place: this.catelogs['places'][0]._id };
    this.dbCallService.getData(data).subscribe((response) => {
      this.daysInHome = response.length;
      this.remainingDaysHome = this.workingDays - this.daysInHome - 12;
    });
  }

  addDetails() {
    const dialogRef = this.dialog.open(CommonPopupComponent, {
      data: {
        title: 'Add Details',
        formObject: [
          { name: 'Place', type: 'select', required: true, options: this.catelogs['places'] },
          { name: 'Date', type: 'date', required: true },
        ],
        width: '300px'
      },
      height: 'auto',
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dbCallService.saveData(result).subscribe((data) => {
          this.ngOnInit(); // Refresh logic after saving data
        });
      }
    });
  }

  // Handle delete action
  onDelete(data: any): void {
    const dialogRef = this.dialog.open(CommonWarningComponent, {
      // height: '400px',
      // width: '600px',
      data: {
        title: 'Delete Confirmation!',
        message: 'Are you sure you want to delete this record?',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        color: 'warn',
        Date: data?.Date
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.dbCallService.deleteData(data?._id).subscribe((data) => {
          this.ngOnInit(); // Refresh logic after deleting data
        });
      }
    });
  }

  onEdit(id: string) {
    console.log("on edit");
  }

  async getCatelogs(catelogList: any) {
    // TODO: Implement logic to fetch catelogs from the API
    catelogList.forEach((catelogItem: string) => {
      this.dbCallService.getCatelogs(catelogItem).subscribe((response) => {
        this.catelogs[catelogItem] = response;
      });
    })
    console.log( this.catelogs);
  }
}
