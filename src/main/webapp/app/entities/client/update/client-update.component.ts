import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IClient, Client } from '../client.model';
import { ClientService } from '../service/client.service';

@Component({
  selector: 'jhi-client-update',
  templateUrl: './client-update.component.html',
})
export class ClientUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    idC: [null, [Validators.required]],
    firstnameC: [null, [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Z][a-z]+$')]],
    lastnameC: [null, [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Z][a-z]+$')]],
    emailC: [],
    phoneC: [],
    addressC: [null, [Validators.required, Validators.maxLength(100)]],
  });

  constructor(protected clientService: ClientService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ client }) => {
      this.updateForm(client);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const client = this.createFromForm();
    if (client.id !== undefined) {
      this.subscribeToSaveResponse(this.clientService.update(client));
    } else {
      this.subscribeToSaveResponse(this.clientService.create(client));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClient>>): void {
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

  protected updateForm(client: IClient): void {
    this.editForm.patchValue({
      id: client.id,
      idC: client.idC,
      firstnameC: client.firstnameC,
      lastnameC: client.lastnameC,
      emailC: client.emailC,
      phoneC: client.phoneC,
      addressC: client.addressC,
    });
  }

  protected createFromForm(): IClient {
    return {
      ...new Client(),
      id: this.editForm.get(['id'])!.value,
      idC: this.editForm.get(['idC'])!.value,
      firstnameC: this.editForm.get(['firstnameC'])!.value,
      lastnameC: this.editForm.get(['lastnameC'])!.value,
      emailC: this.editForm.get(['emailC'])!.value,
      phoneC: this.editForm.get(['phoneC'])!.value,
      addressC: this.editForm.get(['addressC'])!.value,
    };
  }
}
