import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'client',
        data: { pageTitle: 'coopcyclejhipsterApp.client.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'cooperative',
        data: { pageTitle: 'coopcyclejhipsterApp.cooperative.home.title' },
        loadChildren: () => import('./cooperative/cooperative.module').then(m => m.CooperativeModule),
      },
      {
        path: 'driver',
        data: { pageTitle: 'coopcyclejhipsterApp.driver.home.title' },
        loadChildren: () => import('./driver/driver.module').then(m => m.DriverModule),
      },
      {
        path: 'shop',
        data: { pageTitle: 'coopcyclejhipsterApp.shop.home.title' },
        loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
      },
      {
        path: 'cart',
        data: { pageTitle: 'coopcyclejhipsterApp.cart.home.title' },
        loadChildren: () => import('./cart/cart.module').then(m => m.CartModule),
      },
      {
        path: 'command',
        data: { pageTitle: 'coopcyclejhipsterApp.command.home.title' },
        loadChildren: () => import('./command/command.module').then(m => m.CommandModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
