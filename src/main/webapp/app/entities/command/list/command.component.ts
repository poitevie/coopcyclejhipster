import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICommand } from '../command.model';
import { CommandService } from '../service/command.service';
import { CommandDeleteDialogComponent } from '../delete/command-delete-dialog.component';

@Component({
  selector: 'jhi-command',
  templateUrl: './command.component.html',
})
export class CommandComponent implements OnInit {
  commands?: ICommand[];
  isLoading = false;

  constructor(protected commandService: CommandService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.commandService.query().subscribe({
      next: (res: HttpResponse<ICommand[]>) => {
        this.isLoading = false;
        this.commands = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICommand): number {
    return item.id!;
  }

  delete(command: ICommand): void {
    const modalRef = this.modalService.open(CommandDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.command = command;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
