import { Injectable } from '@angular/core';
import {
  Contact,
  ContactValidation,
  PaginatedContacts,
} from './contact-list/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  url = 'https://localhost:7054/api/'; //TODO move to env

  constructor() {}

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
    return (await response.json()) ?? [];
  }

  async getContactById(id: number): Promise<Contact> {
    const response = await fetch(`${this.url}Contact/${id}`);
    if (response.ok) return (await response.json()) ?? {};
    else throw new Error(response.status.toString());
  }

  async putContact(contact: Contact): Promise<ContactValidation | undefined> {
    const response = await fetch(`${this.url}Contact/${contact.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    });
    if (response.ok) return undefined;
    // If the arguments are bad, response will be ContactValidation
    else if (response.status == 400) return await response.json();
    else throw new Error(response.status.toString());
  }

  async postContact(contact: Contact): Promise<ContactValidation | undefined> {
    const response = await fetch(`${this.url}Contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    });
    if (response.ok) return undefined;
    // If the arguments are bad, response will be ContactValidation
    else if (response.status == 400) return await response.json();
    else throw new Error(response.status.toString());
  }

  async deleteContact(id: number): Promise<void> {
    await fetch(`${this.url}Contact/${id}`, {
      method: 'DELETE',
    });
  }
}
