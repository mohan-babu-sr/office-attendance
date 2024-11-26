import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DbCallService } from '../core/db-call.service';
import { CommonPopupComponent } from '../common-popup/common-popup.component';
import * as moment from 'moment';

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
    'place': null
  }
  currentMonthYear = '';
  listOfDays: any;


  constructor(private dialog: MatDialog, private dbCallService: DbCallService) { }

  ngOnInit(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;  // getMonth() returns 0-11, so add 1 to make it 1-12
    const currentYear = currentDate.getFullYear();    // getFullYear() returns the full year (e.g., 2024)

    this.getCurrentMonth();
    this.getTotalWorkingDays(currentMonth, currentYear);
    this.getTotalDaysInOffice();
    this.getTotalDaysInHome();
    this.getListOfDays(this.listParams);
  }

  getListOfDays(listParams: any) {
    listParams.monthYear = this.currentMonthYear;
    this.listParams = {...listParams};
    
    this.dbCallService.getData(this.listParams).subscribe((response) => {
      if (response && Array.isArray(response)) {
        this.listOfDays = response.map((element: any) => {
          return {
            ...element,
            Date: moment(element.Date).format('LLLL'), // Format the Date field
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
    let data = { monthYear: this.currentMonthYear, place: "Office" };
    this.dbCallService.getData(data).subscribe((response) => {
      this.daysInOffice = response.length;
      this.remainingDaysOffice = 12 - this.daysInOffice;
    });
  }

  getTotalDaysInHome() {
    let data = { monthYear: this.currentMonthYear, place: "Home" };
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
          { name: 'Place', type: 'select', required: true, options: ['Office', 'Home'] },
          { name: 'Date', type: 'date', required: true },
        ],
      },
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
  onDelete(id: string): void {
    this.dbCallService.deleteData(id).subscribe((data) => {
      this.ngOnInit(); // Refresh logic after deleting data
    });
  }

  onEdit(id: string) {
    console.log("on edit");
  }
  
}
