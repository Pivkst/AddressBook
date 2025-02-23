using AddressBook.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AddressBook.Controllers
{
    public class ContactDTO
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }

        public static ContactDTO FromModel(ContactModel model)
        {
            return new ContactDTO
            {
                Id = model.Id,
                FirstName = model.FirstName,
                LastName = model.Lastname,
                Address = model.Address,
                PhoneNumber = model.PhoneNumber
            };
        }

        public async Task<(ContactModel?, ContactValidation)> ToModel(AddressBookDbContext context)
        {
            ContactValidation validation = await Validate(context);
            if (validation.Valid)
            {
                return (new ContactModel
                {
                    FirstName = FirstName ?? string.Empty,
                    Lastname = LastName ?? string.Empty,
                    Address = Address ?? string.Empty,
                    PhoneNumber = PhoneNumber ?? string.Empty
                }, validation);
            } else
            {
                return (null, validation);
            }
        }

        public  async Task<ContactValidation> Validate(AddressBookDbContext context)
        {
            ContactValidation error = new ContactValidation();

            if(FirstName.IsNullOrEmpty()) error.FirstName = "Required";
            if(LastName.IsNullOrEmpty()) error.Lastname = "Required";
            if(Address.IsNullOrEmpty()) error.Address = "Required";

            if (PhoneNumber.IsNullOrEmpty()) error.PhoneNumber = "Required";
            else
            {
                if (!int.TryParse(PhoneNumber, out int _)) error.PhoneNumber = "Must be a number";
                else
                {
                    if (await context.Contacts.Where(c => c.PhoneNumber == PhoneNumber).SingleOrDefaultAsync() is not null)
                    {
                        error.PhoneNumber = "Duplicate phone number";
                    }
                }
            }

            return error;
        }
    }

    public class ContactValidation
    {
        public string? FirstName { get; set; } = null;
        public string? Lastname { get; set; } = null;
        public string? Address { get; set; } = null;
        public string? PhoneNumber { get; set; } = null;
        public bool Valid => FirstName is null && Lastname is null && Address is null && PhoneNumber is null;
    }

    public class ContactSearchDTO : ContactDTO
    {
        public int? pageIndex { get; set; }
        public int? pageSize { get; set; }
    }

    public class PaginatedContactsDTO
    {
        public List<ContactDTO> Result { get; set; } = [];
        public int Total { get; set; }
    }
}
