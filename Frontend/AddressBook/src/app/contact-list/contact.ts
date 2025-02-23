export interface Contact {
  id: number | undefined;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
}

export interface PaginatedContacts {
  result: Contact[];
  total: number;
}

export interface ContactValidation {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  valid: boolean;
}
