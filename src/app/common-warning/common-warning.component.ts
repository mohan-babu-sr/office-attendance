import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-warning',
  templateUrl: './common-warning.component.html',
  styleUrls: ['./common-warning.component.scss'],
})
export class CommonWarningComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<CommonWarningComponent>) { }
  dialogData: any;

  ngOnInit(): void {
    this.dialogData = this.data;
  }

  onAction(): void {
    this.dialogRef.close(true); // Close the dialog without saving
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close the dialog without saving
  }
}
