import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private sharedData: { [key: string]: any } = {};

  constructor() {}

  // Setter: Store a value with a key
  setValue(key: string, value: any): void {
    this.sharedData[key] = value;
  }

  // Getter: Retrieve a value by key
  getValue(key: string): any {
    return this.sharedData[key];
  }

  // Check if a key exists
  hasKey(key: string): boolean {
    return this.sharedData.hasOwnProperty(key);
  }

  // Remove a specific key
  removeKey(key: string): void {
    delete this.sharedData[key];
  }

  // Clear all stored data
  clearAll(): void {
    this.sharedData = {};
  }
}

/*
Set a Value:
constructor(private commonService: CommonService) {}

saveData(): void {
  this.commonService.setValue('userData', { name: 'John', age: 30 });
}

Get a Value:

loadData(): void {
  const userData = this.commonService.getValue('userData');
  console.log(userData);
}

Check for a Key:
checkKey(): void {
  if (this.commonService.hasKey('userData')) {
    console.log('Key exists');
  }
}

Remove a Key:
removeData(): void {
  this.commonService.removeKey('userData');
}

Clear All Data:
clearAllData(): void {
  this.commonService.clearAll();
}
*/