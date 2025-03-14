import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  imports: [],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss',
})
export class ErrorModalComponent {
  constructor(private modalService: NgbModal) {}
  @ViewChild('errorModal') modal: ElementRef | undefined;
  errorMessage = '';

  show(message: string) {
    this.errorMessage = message;
    this.modalService.open(this.modal);
  }
}
