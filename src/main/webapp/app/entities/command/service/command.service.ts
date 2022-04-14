import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICommand, getCommandIdentifier } from '../command.model';

export type EntityResponseType = HttpResponse<ICommand>;
export type EntityArrayResponseType = HttpResponse<ICommand[]>;

@Injectable({ providedIn: 'root' })
export class CommandService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/commands');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(command: ICommand): Observable<EntityResponseType> {
    return this.http.post<ICommand>(this.resourceUrl, command, { observe: 'response' });
  }

  update(command: ICommand): Observable<EntityResponseType> {
    return this.http.put<ICommand>(`${this.resourceUrl}/${getCommandIdentifier(command) as number}`, command, { observe: 'response' });
  }

  partialUpdate(command: ICommand): Observable<EntityResponseType> {
    return this.http.patch<ICommand>(`${this.resourceUrl}/${getCommandIdentifier(command) as number}`, command, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICommand>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICommand[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCommandToCollectionIfMissing(commandCollection: ICommand[], ...commandsToCheck: (ICommand | null | undefined)[]): ICommand[] {
    const commands: ICommand[] = commandsToCheck.filter(isPresent);
    if (commands.length > 0) {
      const commandCollectionIdentifiers = commandCollection.map(commandItem => getCommandIdentifier(commandItem)!);
      const commandsToAdd = commands.filter(commandItem => {
        const commandIdentifier = getCommandIdentifier(commandItem);
        if (commandIdentifier == null || commandCollectionIdentifiers.includes(commandIdentifier)) {
          return false;
        }
        commandCollectionIdentifiers.push(commandIdentifier);
        return true;
      });
      return [...commandsToAdd, ...commandCollection];
    }
    return commandCollection;
  }
}
