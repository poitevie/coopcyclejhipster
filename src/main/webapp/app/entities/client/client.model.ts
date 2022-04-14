import { ICart } from 'app/entities/cart/cart.model';
import { ICommand } from 'app/entities/command/command.model';

export interface IClient {
  id?: number;
  idC?: string;
  firstnameC?: string;
  lastnameC?: string;
  emailC?: string | null;
  phoneC?: string | null;
  addressC?: string;
  carts?: ICart[] | null;
  commands?: ICommand[] | null;
}

export class Client implements IClient {
  constructor(
    public id?: number,
    public idC?: string,
    public firstnameC?: string,
    public lastnameC?: string,
    public emailC?: string | null,
    public phoneC?: string | null,
    public addressC?: string,
    public carts?: ICart[] | null,
    public commands?: ICommand[] | null
  ) {}
}

export function getClientIdentifier(client: IClient): number | undefined {
  return client.id;
}
