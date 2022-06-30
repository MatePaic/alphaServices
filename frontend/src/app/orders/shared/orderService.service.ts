import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrder } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  apiURLOrders = environment.apiUrl + 'orders';

  constructor(private http: HttpClient) { }

  getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.apiURLOrders);
  }

  getOrder(orderId: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.apiURLOrders}/${orderId}`);
  }

  createOrder(order: IOrder): Observable<IOrder> {
    return this.http.post<IOrder>(this.apiURLOrders, order);
  }

  getOrderNumbers(): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.apiURLOrders}/get/count`);
  }

  updateOrder(order: IOrder): Observable<IOrder> {
    return this.http.put<IOrder>(`${this.apiURLOrders}/${order.id}`, order);
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLOrders}/${orderId}`);
  }

  exportOrder(orderId: string | undefined) { //binary large object
    return this.http.get(`${this.apiURLOrders}/download-order-summary/${orderId}`, {responseType: 'blob'});
  }
}
