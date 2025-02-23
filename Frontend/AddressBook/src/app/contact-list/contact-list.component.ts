import { Component, inject } from '@angular/core';
import { Contact, PaginatedContacts } from './contact';
import { ContactService } from '../contact.service';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ContactInfoComponent } from './contact-info/contact-info.component';

@Component({
  selector: 'app-contact-list',
  imports: [
    CommonModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    ContactInfoComponent,
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent {
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
