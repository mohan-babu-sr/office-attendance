import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbCallService {

  private apiUrl = 'http://localhost:5000/api/';  // URL to the backend API

  constructor(private http: HttpClient) { }

  getData(data: any): Observable<any> {
    const url = `${this.apiUrl}getData?MonthYear=${data.monthYear}&Place=${data.place}`;
    return this.http.get(url);
  }

  saveData(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'postData', data);
  }

  deleteData(_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}deleteData/${_id}`);
  }
}
