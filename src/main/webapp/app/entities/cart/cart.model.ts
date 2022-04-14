import { ICommand } from 'app/entities/command/command.model';
import { IClient } from 'app/entities/client/client.model';
import { IShop } from 'app/entities/shop/shop.model';

export interface ICart {
  id?: number;
  amount?: number;
  deadline?: number;
  command?: ICommand | null;
  client?: IClient | null;
  shop?: IShop | null;
}

export class Cart implements ICart {
  constructor(
    public id?: number,
    public amount?: number,
    public deadline?: number,
    public command?: ICommand | null,
    public client?: IClient | null,
    public shop?: IShop | null
  ) {}
}

export function getCartIdentifier(cart: ICart): number | undefined {
  return cart.id;
}
