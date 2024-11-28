import { Component, OnInit, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { DbCallService } from '../core/db-call.service';

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.scss'],
})
export class CommonPopupComponent implements OnInit {
  form: FormGroup;
  haveDuplicates: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CommonPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dbCallService: DbCallService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    // Dynamically create form controls based on the `formObject` passed in `data`
    this.data.formObject.forEach((field: any) => {
      let initialValue = field.name === 'Date' ? new Date() : '';

      const control = this.fb.control(
        initialValue,
        field.required ? Validators.required : [], // Add validators if required
      );
      this.form.addControl(field.name, control);
    });

    this.form.valueChanges.subscribe(value => {
      
      // value.MonthYear = this.getCurrentMonthYear(value.Date);
      // value.isFilter = true;
      // value.Date = moment(new Date(value.Date)).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
      // console.log(value);
      // this.dbCallService.getData(value).subscribe((data) => {
      //   if (data.length > 0) { this.haveDuplicates = true; }
      // })
    })

  }


  onNoClick(): void {
    this.form.reset();
    this.dialogRef.close(); // Close the dialog without saving
  }

  saveDetails(): void {
    if (this.form.valid) {
      let formObj = this.form.value;
      if (formObj.Date) {
        formObj.MonthYear = this.getCurrentMonthYear(formObj.Date);
        formObj.Date = moment(new Date(formObj.Date)).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
      }
      this.dialogRef.close(formObj); // Pass form data back to the parent component
    }
  }

  getCurrentMonthYear(date: Date) {
    const currentMonthYear: string = date.toLocaleString('default', { year: 'numeric', month: 'long' });
    return currentMonthYear.replace(' ', '').toLocaleLowerCase();
  }

  onFormChange() {
    if (this.form) {
      console.log(this.form);
    }
  }
}
