import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBike } from './bike.model';

@Injectable({
  providedIn: 'root'
})
export class BikesService {
  apiURLOrders = environment.apiUrl + 'bikes';

  constructor(private http: HttpClient) { }

  getBikes(): Observable<IBike[]> {
    return this.http.get<IBike[]>(this.apiURLOrders);
  }

}
