import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CommandService } from '../service/command.service';

import { CommandComponent } from './command.component';

describe('Command Management Component', () => {
  let comp: CommandComponent;
  let fixture: ComponentFixture<CommandComponent>;
  let service: CommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CommandComponent],
    })
      .overrideTemplate(CommandComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommandComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CommandService);

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
    expect(comp.commands?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
