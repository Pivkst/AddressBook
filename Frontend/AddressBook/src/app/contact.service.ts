import { Injectable } from '@angular/core';
import { Contact, PaginatedContacts } from './contact-list/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  url = 'https://localhost:7054/api/';

  async getAllContacts(
    pageIndex: number,
    pageSize: number,
    search: string = ''
  ): Promise<PaginatedContacts> {
    if (search) {
      search = '/search/' + search;
    }
    const response = await fetch(
      `${this.url}Contact${search}?pageindex=${pageIndex}&pagesize=${pageSize}`
    );
    let jayson = (await response.json()) ?? [];
    return jayson;
  }

  async getContactById(id: number): Promise<Contact> {
    const response = await fetch(`${this.url}Contact/${id}`);
    if (response.ok) return (await response.json()) ?? {};
    else
      return {
        id: 0,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
      };
  }
  constructor() {}
}
