using AddressBook.Data;
using Microsoft.IdentityModel.Tokens;

namespace AddressBook.Controllers
{
    public class ContactDTO
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? Lastname { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }

        public static ContactDTO FromModel(ContactModel model)
        {
            return new ContactDTO
            {
                Id = model.Id,
                FirstName = model.FirstName,
                Lastname = model.Lastname,
                Address = model.Address,
                PhoneNumber = model.PhoneNumber
            };
        }

        public (ContactModel?, ContactValidation) ToModel()
        {
            ContactValidation validation = Validate();
            if (validation.Valid)
            {
                return (new ContactModel
                {
                    FirstName = FirstName ?? string.Empty,
                    Lastname = Lastname ?? string.Empty,
                    Address = Address ?? string.Empty,
                    PhoneNumber = PhoneNumber ?? string.Empty
                }, validation);
            } else
            {
                return (null, validation);
            }
        }

        public ContactValidation Validate()
        {
            ContactValidation error = new ContactValidation();

            if(FirstName.IsNullOrEmpty()) error.FirstName = "Required";
            if(Lastname.IsNullOrEmpty()) error.Lastname = "Required";
            if(Address.IsNullOrEmpty()) error.Address = "Required";

            if(PhoneNumber.IsNullOrEmpty()) error.PhoneNumber = "Required";
            else if(!int.TryParse(PhoneNumber, out int _)) error.PhoneNumber = "Must be a number";

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
}
