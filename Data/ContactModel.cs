using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace AddressBook.Data
{
    [Index(nameof(PhoneNumber), IsUnique = true)]
    public class ContactModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
    }
}
