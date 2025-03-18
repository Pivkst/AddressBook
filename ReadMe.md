# Goals

The goal of the project was to realize a single page address book web-app. The address book stores contacts, which contain a first name, last name, address and phone number. The web-app should enable the user to view, search, add, edit and delete contacts. Contact data should be validated to ensure no fields are empty and that phone numbers are unique.

## Backend

The backend should have a separate database access layer. It should perform data validation and work as a REST API with standard HTTP status codes.

## Frontend

The frontend should have a list view with server-side search and pagination, a single contact view with all of it's information and create and update forms. It should display server-side errors to the user in a modal.

# Setup:

## Backend

1. Download and install MS SQL Server Express version from https://www.microsoft.com/en-us/sql-server/sql-server-downloads, copy the connection string when done
2. Open AddressBook solution in Visual Studio
3. Put the connection string in appsettings.json ( don't overwrite `TrustServerCertificate=true` )
4. Open up Package Manager Console in View->Other Windows (make sure default project is AddressBook) and run:

```
Add-Migration initial
Update-Database
```

5. Build and run AddressBook project (https profile)

## Frontend

1. Download and install [NodeJS](https://nodejs.org/en/download)
2. Install the Angular CLI with `npm install -g @angular/cli@17`
3. Navigate to Frontend/AddressBook/ and run `ng serve`
