import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IBike } from '../shared/bike.model';
import { BikesService } from '../shared/bikesService.service';
import { IOrder } from '../shared/order.model';
import { OrdersService } from '../shared/orderService.service';

@Component({
  selector: 'app-orders-form',
  templateUrl: './orders-form.component.html',
  styleUrls: ['./orders-form.component.css']
})
export class OrdersFormComponent implements OnInit {
  bikes: IBike[] = [];
  selectedBike: IBike = {} as IBike;
  form!: FormGroup;
  isYearSupported = false;
  lastSupportedYear!: number;
  isSubmitted = false;
  editMode = false;
  currentOrderId!: string;
  orderNumber!: number;
  serviceDate!: Date;

  chainChangePrice: number = 0;
  oilChangePrice: number = 0;
  airFilterChangePrice: number = 0;
  brakeFluidChangePrice: number = 0;
  fullPrice: number = 0;
  discount: number = 0;
  discountedPrice: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private bikesService: BikesService,
    private messageService: MessageService,
    private ordersService: OrdersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.currentOrderId = params['id'];
      }
    });
    this._getBikes();
  }

  get orderForm() {
    return this.form.controls;
  }

  private _getBikes() {
    this.bikesService.getBikes().subscribe(bikes => {
      this.bikes = bikes;
      if (this.editMode) {
        this._getOrder(this.currentOrderId);
      } else {
        this._initForm({} as IOrder);
      }
    }, (error: any) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.toString()
      });
    })
  }

  private _getOrder(orderId: string) {
    this.ordersService.getOrder(orderId)
      .subscribe((order: IOrder) => {
        this.selectedBike = this._getBike(order.model);
        this.lastSupportedYear = this.selectedBike.lastSupportedYear;
        if (!this.lastSupportedYear) {
          this.isYearSupported = true;
        } else {
          this.isYearSupported = order.year >= this.lastSupportedYear;
        }
        this.serviceDate = new Date(order.serviceDate);
        this.chainChangePrice = order.chainChangePrice as number;
        this.airFilterChangePrice = order.airFilterChangePrice as number;
        this.oilChangePrice = order.oilChangePrice as number;
        this.brakeFluidChangePrice = order.brakeFluidChangePrice as number;
        this.fullPrice = order.fullPrice;
        this.discount = order.discount;
        this.discountedPrice = order.discountedPrice;
        this._initForm(order);
      }, (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.toString()
        });
      }
    );
  }

  private _addOrder(order: IOrder) {
    this.ordersService.createOrder(order)
      .subscribe((responseOrder: IOrder) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Order for ${responseOrder.model} was created.`
        });
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 2000)
      }, (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.toString()
        });
        }
    );
  }

  private _updateOrder(order: IOrder) {
    this.ordersService.updateOrder(order)
    .subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Order for ${order.model} was updated.`
      });
      setTimeout(() => {
        this.router.navigate(['/orders']);
      }, 2000)
  }, (error: any) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.toString()
      });
      }
  );
  }

  private _getBike(modelName: string): IBike {
    let sentBike = {} as IBike;
    this.bikes.forEach((bike: IBike) => {
      if (bike.model === modelName) {
        sentBike = bike;
      }
    });
    return sentBike;
  }

  private _initForm(order: IOrder) {
    if (!!order.serviceDate) {
      this.serviceDate = new Date(order.serviceDate);
    }
    this.form = this.formBuilder.group({
      brand: [{ value: order.brand || '', disabled: true }, Validators.required],
      model: [{ value: this._getBike(order.model)  || {}, disabled: this.editMode }, Validators.required],
      serviceDate: [new Date(order.serviceDate) || '', Validators.required],
      year: [{value: order.year || '', disabled: this.editMode}, Validators.required],
      mileage: [order.mileage || '', Validators.required],
      chain: [!!order.chainChangePrice || false],
      oil: [!!order.oilChangePrice || false],
      air: [!!order.airFilterChangePrice || false],
      brake: [!!order.brakeFluidChangePrice || false]
    });

    this.orderForm['model'].valueChanges.subscribe((selectedBike: IBike) => {
      this.selectedBike = selectedBike;
      this.orderForm['brand'].patchValue(this.selectedBike.brand);
      this.chainChangePrice = 0;
      this.oilChangePrice = 0;
      this.airFilterChangePrice = 0;
      this.brakeFluidChangePrice = 0;
      this.lastSupportedYear = this.selectedBike.lastSupportedYear ;
      if (!this.lastSupportedYear) {
        this.isYearSupported = true;
      }
      this._calculateFullPrice();
    });

    this.orderForm['year'].valueChanges.subscribe((selectedYear: number) => {
      if (!!selectedYear && !!this.lastSupportedYear) {
        this.isYearSupported = selectedYear >= this.lastSupportedYear;
      }
    });

    this.orderForm['chain'].valueChanges.subscribe((selected: boolean) => {
      this._calculateFullPrice();
    });

    this.orderForm['oil'].valueChanges.subscribe((selected: boolean) => {
      this._calculateFullPrice();
    });

    this.orderForm['air'].valueChanges.subscribe((selected: boolean) => {
      this._calculateFullPrice();
    });

    this.orderForm['brake'].valueChanges.subscribe((selected: boolean) => {
      this._calculateFullPrice();
    });
  }

  private _calculateFullPrice() {
    const isChainSelected = this.orderForm['chain'].value;
    const isOilSelected = this.orderForm['oil'].value;
    const isAirSelected = this.orderForm['air'].value;
    const isBrakeSelected = this.orderForm['brake'].value;

    if (isChainSelected && isOilSelected && isAirSelected && isBrakeSelected) {
      this.fullPrice =
        this._getChainChangePrice() +
        this._getOilChangePrice() +
        this._getAirChangePrice() +
        this._getBrakeChangePrice();
      this.discount = this._getDollarAmountFromEuroAmount(40);
      this.discountedPrice = this.fullPrice - this.discount;
    } else if (isChainSelected && isOilSelected && isAirSelected && !isBrakeSelected) {
      this.fullPrice =
        this._getChainChangePrice() +
        this._getOilChangePrice() +
        this._getAirChangePrice();
      this.discount = this._getDollarAmountPercentage(this.fullPrice, 0.2);
      this.discountedPrice = this.fullPrice - this.discount;
    } else if (!isChainSelected && isOilSelected && isAirSelected && !isBrakeSelected) {
      this.fullPrice =
        this._getOilChangePrice() +
        this._getAirChangePrice();
      this.discount = this._getDollarAmountFromEuroAmount(20);
      this.discountedPrice = this.fullPrice - this.discount;
    } else if (isChainSelected && !isOilSelected && !isAirSelected && isBrakeSelected) {
      this.fullPrice =
        this._getChainChangePrice() +
        this._getBrakeChangePrice();
      this.discount = this._getDollarAmountPercentage(this.fullPrice, 0.15);
      this.discountedPrice = this.fullPrice - this.discount;
    } else {
      this.fullPrice = 0;
      this.discount = 0;
      this.discountedPrice = 0;
      if (isChainSelected) {
        this.fullPrice += this._getChainChangePrice();
      }
      if (isOilSelected) {
        this.fullPrice += this._getOilChangePrice();
      }
      if (isAirSelected) {
        this.fullPrice += this._getAirChangePrice();
      }
      if (isBrakeSelected) {
        this.fullPrice += this._getBrakeChangePrice();
      }
    }
  }

  private _getChainChangePrice(): number {
    return this.selectedBike.chainChangePrice || 0;
  }

  private _getOilChangePrice(): number {
    return this.selectedBike.oilAndOilFilterChangePrice || 0;
  }

  private _getAirChangePrice(): number {
    return this.selectedBike.airFilterChangePrice || 0;
  }

  private _getBrakeChangePrice(): number {
    return this.selectedBike.brakeFluidChangePrice || 0;
  }

  private _getDollarAmountFromEuroAmount(euroAmount: number): number {
    // in real world we would actually need to call Hnb Rest Api to get real euro dollar exchange rate
    const euroDollarExchangeRateRatio = 1.05;
    return euroAmount * euroDollarExchangeRateRatio;
  }

  private _getDollarAmountPercentage(price: number, percentage: number): number {
    return price * percentage;
  }

  public onChainChange(event: any) {
    if (event.checked) {
      this.chainChangePrice = this._getChainChangePrice();
    } else if (!event.checked) {
      this.chainChangePrice = 0;
    }
  }

  public onOilChange(event: any) {
    if (event.checked) {
      this.oilChangePrice = this._getOilChangePrice();
    } else if (!event.checked) {
      this.oilChangePrice = 0;
    }
  }

  public onAirChange(event: any) {
    if (event.checked) {
      this.airFilterChangePrice = this._getAirChangePrice();
    }else if (!event.checked) {
      this.airFilterChangePrice = 0;
    }
  }

  public onBrakeChange(event: any) {
    if (event.checked) {
      this.brakeFluidChangePrice = this._getBrakeChangePrice();
    }else if (!event.checked) {
      this.brakeFluidChangePrice = 0;
    }
  }

  public onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const order: IOrder = {
      bikeId: this.selectedBike.id,
      brand: this.selectedBike.brand,
      model: this.selectedBike.model,
      serviceDate: this.orderForm['serviceDate'].value,
      year: this.orderForm['year'].value,
      mileage: this.orderForm['mileage'].value,
      chainChangePrice: this.chainChangePrice,
      oilChangePrice: this.oilChangePrice,
      airFilterChangePrice: this.airFilterChangePrice,
      brakeFluidChangePrice: this.brakeFluidChangePrice,
      fullPrice: this.fullPrice,
      discount: this.discount,
      discountedPrice: this.discountedPrice,
      orderNumber: this.orderNumber
    };
    if (this.editMode) {
      order.id = this.currentOrderId;
      this._updateOrder(order);
    } else {
      this._addOrder(order);
    }
  }
}
