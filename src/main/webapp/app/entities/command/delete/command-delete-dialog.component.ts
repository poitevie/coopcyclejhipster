import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICommand } from '../command.model';
import { CommandService } from '../service/command.service';

@Component({
  templateUrl: './command-delete-dialog.component.html',
})
export class CommandDeleteDialogComponent {
  command?: ICommand;

  constructor(protected commandService: CommandService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commandService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
