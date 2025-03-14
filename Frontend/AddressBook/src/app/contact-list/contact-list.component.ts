import { Component, inject, ViewChild } from '@angular/core';
import { Contact, PaginatedContacts } from './contact';
import { ContactService } from '../contact.service';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-contact-list',
  imports: [
    CommonModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    ContactInfoComponent,
    ErrorModalComponent,
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent {
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;
  contacts: Contact[] = [];
  contactService: ContactService = inject(ContactService);
  page = 1;
  pageSize = 10;
  collectionSize = this.contacts.length;
  filter = new FormControl('', { nonNullable: true });
  filterValue = '';

  selectedContactId = 0;
  contactPopupVisible = false;

  constructor() {
    this.refreshContacts();
    this.filter.valueChanges
      .pipe(debounceTime(500))
      .subscribe((valueChanges) => {
        this.filterValue = valueChanges;
        this.refreshContacts();
      });
  }

  refreshContacts() {
    this.contactService
      .getAllContacts(this.page - 1, this.pageSize, this.filterValue)
      .then((contacts: PaginatedContacts) => {
        this.contacts = contacts.result;
        this.collectionSize = contacts.total;
      })
      .catch((error) => {
        this.errorModal.show(error.toString());
      });
  }

  showContact(id: number) {
    this.selectedContactId = id;
    this.contactPopupVisible = true;
  }

  hideContact() {
    this.contactPopupVisible = false;
  }
}
