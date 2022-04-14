import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICommand, Command } from '../command.model';
import { CommandService } from '../service/command.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IDriver } from 'app/entities/driver/driver.model';
import { DriverService } from 'app/entities/driver/service/driver.service';

@Component({
  selector: 'jhi-command-update',
  templateUrl: './command-update.component.html',
})
export class CommandUpdateComponent implements OnInit {
  isSaving = false;

  clientsSharedCollection: IClient[] = [];
  driversSharedCollection: IDriver[] = [];

  editForm = this.fb.group({
    id: [],
    addressC: [null, [Validators.required]],
    dateC: [null, [Validators.required]],
    client: [],
    driver: [],
  });

  constructor(
    protected commandService: CommandService,
    protected clientService: ClientService,
    protected driverService: DriverService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ command }) => {
      this.updateForm(command);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const command = this.createFromForm();
    if (command.id !== undefined) {
      this.subscribeToSaveResponse(this.commandService.update(command));
    } else {
      this.subscribeToSaveResponse(this.commandService.create(command));
    }
  }

  trackClientById(_index: number, item: IClient): number {
    return item.id!;
  }

  trackDriverById(_index: number, item: IDriver): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommand>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(command: ICommand): void {
    this.editForm.patchValue({
      id: command.id,
      addressC: command.addressC,
      dateC: command.dateC,
      client: command.client,
      driver: command.driver,
    });

    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing(this.clientsSharedCollection, command.client);
    this.driversSharedCollection = this.driverService.addDriverToCollectionIfMissing(this.driversSharedCollection, command.driver);
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing(clients, this.editForm.get('client')!.value)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));

    this.driverService
      .query()
      .pipe(map((res: HttpResponse<IDriver[]>) => res.body ?? []))
      .pipe(map((drivers: IDriver[]) => this.driverService.addDriverToCollectionIfMissing(drivers, this.editForm.get('driver')!.value)))
      .subscribe((drivers: IDriver[]) => (this.driversSharedCollection = drivers));
  }

  protected createFromForm(): ICommand {
    return {
      ...new Command(),
      id: this.editForm.get(['id'])!.value,
      addressC: this.editForm.get(['addressC'])!.value,
      dateC: this.editForm.get(['dateC'])!.value,
      client: this.editForm.get(['client'])!.value,
      driver: this.editForm.get(['driver'])!.value,
    };
  }
}
