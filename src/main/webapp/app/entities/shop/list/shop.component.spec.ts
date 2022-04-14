import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ShopService } from '../service/shop.service';

import { ShopComponent } from './shop.component';

describe('Shop Management Component', () => {
  let comp: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;
  let service: ShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ShopComponent],
    })
      .overrideTemplate(ShopComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShopComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ShopService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.shops?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
