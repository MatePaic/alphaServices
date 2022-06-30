import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IOrder } from '../shared/order.model';
import { OrdersService } from '../shared/orderService.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
  // orders = [
  //   {
  //     brand: 'mate',
  //     model: 1,
  //     lastSupportedYear: '1991',
  //     chainChangePrice: '34',
  //     oilAndOilFilerChangePrice: '12',
  //     airFilterChangePrice: '12',
  //     brakeFluidChangePrice: '23',
  //   },
  //   {
  //     brand: 'mate',
  //     model: 1,
  //     lastSupportedYear: '1991',
  //     chainChangePrice: '34',
  //     oilAndOilFilerChangePrice: '12',
  //     airFilterChangePrice: '45',
  //     brakeFluidChangePrice: '34',
  //   },
  //   {
  //     brand: 'mate',
  //     model: 1,
  //     lastSupportedYear: '1991',
  //     chainChangePrice: '12',
  //     oilAndOilFilerChangePrice: '12',
  //     airFilterChangePrice: '67',
  //     brakeFluidChangePrice: '343',
  //   },
  //   {
  //     brand: 'mate',
  //     model: 1,
  //     lastSupportedYear: '1991',
  //     chainChangePrice: '45',
  //     oilAndOilFilerChangePrice: '12',
  //     airFilterChangePrice: '78',
  //     brakeFluidChangePrice: '45',
  //   }
  // ]
  createdOrder = true;
  orders: IOrder[] = [];
  order!: IOrder;
  orderNumber!: number;
  currentOrderId!: string;
  editMode = false;

  constructor(
    private ordersService: OrdersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this._getOrders();
    if (this.createdOrder) {
      this.ordersService.getOrders().subscribe(orders => {
        this.orders = orders;
      })
    }
  }

  private _getOrders() {
    this.ordersService.getOrders().subscribe((orders) => {
      this.orders = orders;
      if (this.orders.length === 0) {
        this.createdOrder = false;
      }
    })
  }

  public deleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Order?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.deleteOrder(orderId).subscribe(
          () => {
            this._getOrders();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Order is deleted!'
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Order is not deleted!'
            });
          }
        );
      }
    });
  }

  public viewOrder(orderId: string) {
    this.ordersService.getOrder(orderId).subscribe((order) => {
      this.order = order;
    })
  }

  public updateOrder(orderId: string) {
    this.router.navigate([`orders/form/${orderId}`]);
  }

  public downloadOrderSummery(orderId: string | undefined) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Order will be downloaded shortly!'
    });
    this.ordersService.exportOrder(orderId).subscribe(data => {
      saveAs(data, `order-summery/${this.order.orderNumber}.pdf`);
    }, (error: any) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: JSON.stringify(error)
      });
    });
  }
}
