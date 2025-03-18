import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { ErrorModalComponent } from '../../error-modal/error-modal.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../contact.service';
import { ContactValidation } from '../contact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-create',
  imports: [CommonModule, ReactiveFormsModule, ErrorModalComponent],
  templateUrl: './contact-create.component.html',
  styleUrl: './contact-create.component.scss',
})
export class ContactCreateComponent {
  @Output() onClosed = new EventEmitter<void>();
  @Output() onCreated = new EventEmitter<void>();
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;
  form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true }),
    lastName: new FormControl('', { nonNullable: true }),
    phoneNumber: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
  });
  contactService: ContactService = inject(ContactService);
  validation: ContactValidation = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    valid: true,
  };

  close() {
    this.onClosed.emit();
  }

  save() {
    this.contactService
      .postContact({
        id: undefined,
        firstName: this.form.value.firstName ?? '',
        lastName: this.form.value.lastName ?? '',
        phoneNumber: this.form.value.phoneNumber ?? '',
        address: this.form.value.address ?? '',
      })
      .then((response) => {
        if (response === undefined) {
          this.close();
          this.onCreated.emit();
        } else {
          this.validation = response;
        }
      })
      .catch((reason) => {
        this.errorModal.show(reason.toString());
      });
  }

  cancel() {
    this.form.reset();
    this.validation = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      valid: true,
    };
    this.close();
  }
}
