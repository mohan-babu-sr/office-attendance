import { Component, OnInit, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.scss'],
})
export class CommonPopupComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CommonPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    // Dynamically create form controls based on the `formObject` passed in `data`
    this.data.formObject.forEach((field: any) => {
      let initialValue = field.name === 'Date' ? new Date() : '';

      if (field.type === 'select') {
        initialValue = field.options[0]; // Default to the first option, or set another default if needed
      }

      const control = this.fb.control(
        initialValue,
        field.required ? Validators.required : [], // Add validators if required
      );
      this.form.addControl(field.name, control);
    });
    console.log(this.form);
  }

  onNoClick(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }

  saveDetails(): void {
    if (this.form.valid) {
      let formObj = this.form.value;
      if (formObj.Date) {
        formObj.MonthYear = this.getCurrentMonthYear(formObj.Date);
        formObj.Date = new Date(formObj.Date);
      }
      this.dialogRef.close(formObj); // Pass form data back to the parent component
    } else {
      console.error('Form is invalid:', this.form.errors);
    }
  }

  getCurrentMonthYear(date: Date) {
    const currentMonthYear: string = date.toLocaleString('default', { year: 'numeric', month: 'long' });
    return currentMonthYear.replace(' ', '').toLocaleLowerCase();
  }
}
