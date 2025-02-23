import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { ContactService } from '../../contact.service';
import { Contact } from '../contact';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-info',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss',
})
export class ContactInfoComponent {
  @Input() id: number = 0;
  @Output() closed = new EventEmitter<void>();
  form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true }),
    lastName: new FormControl('', { nonNullable: true }),
    phoneNumber: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
  });
  contactService: ContactService = inject(ContactService);
  editing: boolean = false;
  constructor() {
    this.form.disable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      this.contactService.getContactById(this.id).then((contact: Contact) => {
        this.form.setValue({
          firstName: contact.firstName,
          lastName: contact.lastName,
          phoneNumber: contact.phoneNumber,
          address: contact.address,
        });
      });
    }
    if (changes['visible']) {
      document.getElementById('popup');
    }
  }

  close() {
    this.closed.emit();
  }

  edit() {
    this.form.enable();
    this.editing = true;
  }
}
