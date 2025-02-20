Setup:
1. Download and install MS SQL Server Express version from https://www.microsoft.com/en-us/sql-server/sql-server-downloads, copy the connection string when done
2. Open AddressBook solution in Visual Studio
3. Put the connection string in appsettings.json ( don't overwrite TrustServerCertificate=true )
4. Open up Package Manager Console in View->Other Windows (make sure default project is AddressBook) and run:
	Add-Migration initial
	Update-Database
5. Build and run AddressBook project (https profile)