import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent {

  @Input() dataSource: any[] = [];
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<any>();

  columns = [
    { key: 'S.No', label: 'S.No', isIndex: true, width: '15%' }, // Width set to 10%
    { key: 'Date', label: 'Date', width: '45%' },               // Width set to 30%
    { key: 'Place', label: 'Place', width: '20%' },             // Width set to 30%
    { key: 'Action', label: 'Action', width: '20%' },           // Width set to 30%
  ];
  

  get displayedColumns(): string[] {
    return this.columns.map(col => col.key);
  }

  editData(element: any): void {
    this.edit.emit(element);
  }

  deleteData(data: string): void {
    this.delete.emit(data);
  }

}
