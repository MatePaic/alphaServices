export interface IOrder {
  id?: string;
  bikeId: string;
  brand: string;
  model: string;
  serviceDate: string;
  year: number;
  mileage: number;
  chainChangePrice?: number;
  oilChangePrice?: number;
  airFilterChangePrice?: number;
  brakeFluidChangePrice?: number;
  fullPrice: number;
  discount: number;
  discountedPrice: number;
  orderNumber: number;
}
