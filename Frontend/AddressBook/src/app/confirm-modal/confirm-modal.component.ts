import {
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  constructor(private modalService: NgbModal) {}
  @ViewChild('confirmModal') modal: ElementRef | undefined;
  @Output() onConfirm = new EventEmitter<void>();
  warningMessage = '';

  show(message: string = '') {
    this.warningMessage = message;
    this.modalService.open(this.modal);
  }

  confirm() {
    this.onConfirm.emit();
  }
}
