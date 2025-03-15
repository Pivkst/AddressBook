import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ContactService } from '../../contact.service';
import { Contact, ContactValidation } from '../contact';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorModalComponent } from '../../error-modal/error-modal.component';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-contact-info',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ErrorModalComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss',
})
export class ContactInfoComponent {
  @Input() id: number = 0;
  @Output() onClosed = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<void>();
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;
  @ViewChild(ConfirmModalComponent) confirmDeleteModal!: ConfirmModalComponent;
  form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true }),
    lastName: new FormControl('', { nonNullable: true }),
    phoneNumber: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
  });
  contactService: ContactService = inject(ContactService);
  editing: boolean = false;
  errorMessage: string = '';
  validation: ContactValidation = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    valid: true,
  };
  oldContactInfo: {
    firstName?: string | undefined;
    lastName?: string | undefined;
    phoneNumber?: string | undefined;
    address?: string | undefined;
  } = {};

  constructor() {
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
          this.errorModal.show(reason.toString());
        });
    }
  }

  close() {
    this.onClosed.emit();
  }

  edit() {
    this.oldContactInfo = { ...this.form.value };
    this.form.enable();
    this.editing = true;
  }

  save() {
    this.contactService
      .putContact({
        id: this.id,
        firstName: this.form.value.firstName ?? '',
        lastName: this.form.value.lastName ?? '',
        phoneNumber: this.form.value.phoneNumber ?? '',
        address: this.form.value.address ?? '',
      })
      .then((response) => {
        if (response === undefined) {
          this.stopEditing();
          this.close();
          this.onChange.emit();
        } else {
          this.validation = response;
        }
      })
      .catch((reason) => {
        this.errorModal.show(reason.toString());
      });
  }

  stopEditing() {
    this.form.setValue({
      firstName: this.oldContactInfo.firstName ?? '',
      lastName: this.oldContactInfo.lastName ?? '',
      phoneNumber: this.oldContactInfo.phoneNumber ?? '',
      address: this.oldContactInfo.address ?? '',
    });
    this.validation = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      valid: true,
    };
    this.form.disable();
    this.editing = false;
  }

  showDeleteModal() {
    this.confirmDeleteModal.show('This cannot be undone.');
  }

  deleteContact() {
    this.contactService
      .deleteContact(this.id)
      .then(() => {
        this.onChange.emit();
        this.close();
      })
      .catch((reason) => {
        this.errorModal.show(reason.toString());
      });
  }
}
