import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ContactService } from '../../contact.service';
import { Contact } from '../contact';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-info',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss',
})
export class ContactInfoComponent {
  @Input() id: number = 0;
  @Output() onClosed = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<void>();
  @ViewChild('errorModal') errorModal: ElementRef | undefined;
  form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true }),
    lastName: new FormControl('', { nonNullable: true }),
    phoneNumber: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
  });
  contactService: ContactService = inject(ContactService);
  editing: boolean = false;
  errorMessage: string = '';

  constructor(private modalService: NgbModal) {
    this.form.disable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      this.contactService
        .getContactById(this.id)
        .then((contact: Contact) => {
          this.form.setValue({
            firstName: contact.firstName,
            lastName: contact.lastName,
            phoneNumber: contact.phoneNumber,
            address: contact.address,
          });
          this.form.markAsPristine();
        })
        .catch((reason) => {
          this.showError(reason.toString());
        });
    }
  }

  close() {
    this.onClosed.emit();
  }

  edit() {
    this.form.enable();
    this.editing = true;
  }

  save() {
    this.contactService
      .putContact({
        id: this.id,
        firstName: this.form.controls.firstName.dirty
          ? this.form.value.firstName ?? ''
          : '',
        lastName: this.form.controls.lastName.dirty
          ? this.form.value.lastName ?? ''
          : '',
        phoneNumber: this.form.controls.phoneNumber.dirty
          ? this.form.value.phoneNumber ?? ''
          : '',
        address: this.form.controls.address.dirty
          ? this.form.value.address ?? ''
          : '',
      })
      .then((response) => {
        if (response === undefined) {
          this.stopEditing();
          this.close();
          this.onChange.emit();
        } else {
          if (response.phoneNumber) this.showError(response.phoneNumber);
        }
      })
      .catch((reason) => {
        this.showError(reason.toString());
      });
  }

  stopEditing() {
    this.form.disable();
    this.editing = false;
  }

  showError(errorMessage: string) {
    this.errorMessage = errorMessage;
    this.modalService.open(this.errorModal);
  }
}
