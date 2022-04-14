import { ICart } from 'app/entities/cart/cart.model';

export interface IShop {
  id?: number;
  addressS?: string;
  menu?: string | null;
  carts?: ICart[] | null;
}

export class Shop implements IShop {
  constructor(public id?: number, public addressS?: string, public menu?: string | null, public carts?: ICart[] | null) {}
}

export function getShopIdentifier(shop: IShop): number | undefined {
  return shop.id;
}
