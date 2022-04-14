import { IClient } from 'app/entities/client/client.model';
import { ICart } from 'app/entities/cart/cart.model';
import { IDriver } from 'app/entities/driver/driver.model';

export interface ICommand {
  id?: number;
  addressC?: string;
  dateC?: number;
  client?: IClient | null;
  cart?: ICart | null;
  driver?: IDriver | null;
}

export class Command implements ICommand {
  constructor(
    public id?: number,
    public addressC?: string,
    public dateC?: number,
    public client?: IClient | null,
    public cart?: ICart | null,
    public driver?: IDriver | null
  ) {}
}

export function getCommandIdentifier(command: ICommand): number | undefined {
  return command.id;
}
