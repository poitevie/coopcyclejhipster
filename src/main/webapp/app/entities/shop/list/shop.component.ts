import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IShop } from '../shop.model';
import { ShopService } from '../service/shop.service';
import { ShopDeleteDialogComponent } from '../delete/shop-delete-dialog.component';

@Component({
  selector: 'jhi-shop',
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit {
  shops?: IShop[];
  isLoading = false;

  constructor(protected shopService: ShopService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.shopService.query().subscribe({
      next: (res: HttpResponse<IShop[]>) => {
        this.isLoading = false;
        this.shops = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IShop): number {
    return item.id!;
  }

  delete(shop: IShop): void {
    const modalRef = this.modalService.open(ShopDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.shop = shop;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
