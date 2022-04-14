import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDriver, Driver } from '../driver.model';
import { DriverService } from '../service/driver.service';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';
import { CooperativeService } from 'app/entities/cooperative/service/cooperative.service';

@Component({
  selector: 'jhi-driver-update',
  templateUrl: './driver-update.component.html',
})
export class DriverUpdateComponent implements OnInit {
  isSaving = false;

  cooperativesSharedCollection: ICooperative[] = [];

  editForm = this.fb.group({
    id: [],
    firstnameD: [null, [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Z][a-z]+$')]],
    lastnameD: [null, [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Z][a-z]+$')]],
    phoneD: [],
    cooperative: [],
  });

  constructor(
    protected driverService: DriverService,
    protected cooperativeService: CooperativeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ driver }) => {
      this.updateForm(driver);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const driver = this.createFromForm();
    if (driver.id !== undefined) {
      this.subscribeToSaveResponse(this.driverService.update(driver));
    } else {
      this.subscribeToSaveResponse(this.driverService.create(driver));
    }
  }

  trackCooperativeById(_index: number, item: ICooperative): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDriver>>): void {
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

  protected updateForm(driver: IDriver): void {
    this.editForm.patchValue({
      id: driver.id,
      firstnameD: driver.firstnameD,
      lastnameD: driver.lastnameD,
      phoneD: driver.phoneD,
      cooperative: driver.cooperative,
    });

    this.cooperativesSharedCollection = this.cooperativeService.addCooperativeToCollectionIfMissing(
      this.cooperativesSharedCollection,
      driver.cooperative
    );
  }

  protected loadRelationshipsOptions(): void {
    this.cooperativeService
      .query()
      .pipe(map((res: HttpResponse<ICooperative[]>) => res.body ?? []))
      .pipe(
        map((cooperatives: ICooperative[]) =>
          this.cooperativeService.addCooperativeToCollectionIfMissing(cooperatives, this.editForm.get('cooperative')!.value)
        )
      )
      .subscribe((cooperatives: ICooperative[]) => (this.cooperativesSharedCollection = cooperatives));
  }

  protected createFromForm(): IDriver {
    return {
      ...new Driver(),
      id: this.editForm.get(['id'])!.value,
      firstnameD: this.editForm.get(['firstnameD'])!.value,
      lastnameD: this.editForm.get(['lastnameD'])!.value,
      phoneD: this.editForm.get(['phoneD'])!.value,
      cooperative: this.editForm.get(['cooperative'])!.value,
    };
  }
}
