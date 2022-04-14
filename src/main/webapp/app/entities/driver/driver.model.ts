import { ICommand } from 'app/entities/command/command.model';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';

export interface IDriver {
  id?: number;
  firstnameD?: string;
  lastnameD?: string;
  phoneD?: string | null;
  commands?: ICommand[] | null;
  cooperative?: ICooperative | null;
}

export class Driver implements IDriver {
  constructor(
    public id?: number,
    public firstnameD?: string,
    public lastnameD?: string,
    public phoneD?: string | null,
    public commands?: ICommand[] | null,
    public cooperative?: ICooperative | null
  ) {}
}

export function getDriverIdentifier(driver: IDriver): number | undefined {
  return driver.id;
}
