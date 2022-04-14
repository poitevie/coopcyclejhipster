import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommandService } from '../service/command.service';
import { ICommand, Command } from '../command.model';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IDriver } from 'app/entities/driver/driver.model';
import { DriverService } from 'app/entities/driver/service/driver.service';

import { CommandUpdateComponent } from './command-update.component';

describe('Command Management Update Component', () => {
  let comp: CommandUpdateComponent;
  let fixture: ComponentFixture<CommandUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commandService: CommandService;
  let clientService: ClientService;
  let driverService: DriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CommandUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CommandUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommandUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commandService = TestBed.inject(CommandService);
    clientService = TestBed.inject(ClientService);
    driverService = TestBed.inject(DriverService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Client query and add missing value', () => {
      const command: ICommand = { id: 456 };
      const client: IClient = { id: 21981 };
      command.client = client;

      const clientCollection: IClient[] = [{ id: 50915 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ command });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(clientCollection, ...additionalClients);
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Driver query and add missing value', () => {
      const command: ICommand = { id: 456 };
      const driver: IDriver = { id: 47256 };
      command.driver = driver;

      const driverCollection: IDriver[] = [{ id: 4310 }];
      jest.spyOn(driverService, 'query').mockReturnValue(of(new HttpResponse({ body: driverCollection })));
      const additionalDrivers = [driver];
      const expectedCollection: IDriver[] = [...additionalDrivers, ...driverCollection];
      jest.spyOn(driverService, 'addDriverToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ command });
      comp.ngOnInit();

      expect(driverService.query).toHaveBeenCalled();
      expect(driverService.addDriverToCollectionIfMissing).toHaveBeenCalledWith(driverCollection, ...additionalDrivers);
      expect(comp.driversSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const command: ICommand = { id: 456 };
      const client: IClient = { id: 99436 };
      command.client = client;
      const driver: IDriver = { id: 36765 };
      command.driver = driver;

      activatedRoute.data = of({ command });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(command));
      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.driversSharedCollection).toContain(driver);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Command>>();
      const command = { id: 123 };
      jest.spyOn(commandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ command });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: command }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(commandService.update).toHaveBeenCalledWith(command);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Command>>();
      const command = new Command();
      jest.spyOn(commandService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ command });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: command }));
      saveSubject.complete();

      // THEN
      expect(commandService.create).toHaveBeenCalledWith(command);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Command>>();
      const command = { id: 123 };
      jest.spyOn(commandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ command });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commandService.update).toHaveBeenCalledWith(command);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackClientById', () => {
      it('Should return tracked Client primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackClientById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackDriverById', () => {
      it('Should return tracked Driver primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDriverById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
