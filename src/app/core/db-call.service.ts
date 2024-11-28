import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbCallService {

  private apiUrl = environment.apiUrl;  // URL to the backend API

  constructor(private http: HttpClient) { }

  getData(data: any): Observable<any> {
    const url = `${this.apiUrl}getData?MonthYear=${data.monthYear}&Place=${data.place}&sortBy=${data.sortBy}`;
    return this.http.get(url);
  }

  getCatelogs(modelName: any): Observable<any> {
    const url = `${this.apiUrl}getCatelogs?modelName=${modelName}`;
    return this.http.get(url);
  }

  saveData(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'postData', data);
  }

  deleteData(_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}deleteData/${_id}`);
  }
}
