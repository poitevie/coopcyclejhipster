import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShop, getShopIdentifier } from '../shop.model';

export type EntityResponseType = HttpResponse<IShop>;
export type EntityArrayResponseType = HttpResponse<IShop[]>;

@Injectable({ providedIn: 'root' })
export class ShopService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shops');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shop: IShop): Observable<EntityResponseType> {
    return this.http.post<IShop>(this.resourceUrl, shop, { observe: 'response' });
  }

  update(shop: IShop): Observable<EntityResponseType> {
    return this.http.put<IShop>(`${this.resourceUrl}/${getShopIdentifier(shop) as number}`, shop, { observe: 'response' });
  }

  partialUpdate(shop: IShop): Observable<EntityResponseType> {
    return this.http.patch<IShop>(`${this.resourceUrl}/${getShopIdentifier(shop) as number}`, shop, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShop>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShop[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addShopToCollectionIfMissing(shopCollection: IShop[], ...shopsToCheck: (IShop | null | undefined)[]): IShop[] {
    const shops: IShop[] = shopsToCheck.filter(isPresent);
    if (shops.length > 0) {
      const shopCollectionIdentifiers = shopCollection.map(shopItem => getShopIdentifier(shopItem)!);
      const shopsToAdd = shops.filter(shopItem => {
        const shopIdentifier = getShopIdentifier(shopItem);
        if (shopIdentifier == null || shopCollectionIdentifiers.includes(shopIdentifier)) {
          return false;
        }
        shopCollectionIdentifiers.push(shopIdentifier);
        return true;
      });
      return [...shopsToAdd, ...shopCollection];
    }
    return shopCollection;
  }
}
