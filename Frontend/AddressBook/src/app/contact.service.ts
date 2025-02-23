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
    const data = await fetch(
      `${this.url}Contact${search}?pageindex=${pageIndex}&pagesize=${pageSize}`
    );
    let jayson = (await data.json()) ?? [];
    return jayson;
  }

  async getContactById(id: number): Promise<Contact> {
    const data = await fetch(`${this.url}Contact/${id}`);
    return (await data.json()) ?? {};
  }
  constructor() {}
}
