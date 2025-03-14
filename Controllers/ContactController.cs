using System.Reflection.Metadata.Ecma335;
using AddressBook.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AddressBook.Controllers
{
    //You can see the paths in /openapi/v1.json
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController(AddressBookDbContext context) : ControllerBase
    {
        private readonly AddressBookDbContext _context = context;

        [HttpGet]
        public async Task<ActionResult<PaginatedContactsDTO>> Get(int? pageIndex, int? pageSize)
        {
            // Get all contacts with pagination
            var queryable = _context.Contacts.OrderBy(a => a.Id).Select(a => ContactDTO.FromModel(a));
            return Ok(await PaginateContacts(queryable, pageIndex, pageSize));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ContactDTO>> GetId(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact is null) return NotFound();

            return Ok(ContactDTO.FromModel(contact));
        }

        [Route("Search/{query}")]
        [HttpGet]
        public async Task<ActionResult<PaginatedContactsDTO>> SearchByAttributes(string query, int? pageIndex, int? pageSize)
        {
            // Search contacts by all attributes with pagination
            var queryable = _context.Contacts.Where(a =>
                a.FirstName.Contains(query) ||
                a.LastName.Contains(query) ||
                a.Address.Contains(query) ||
                a.PhoneNumber.Contains(query))
                .Select(a => ContactDTO.FromModel(a));

            return Ok(await PaginateContacts(queryable, pageIndex, pageSize));
        }

        private static async Task<PaginatedContactsDTO> PaginateContacts(IQueryable<ContactDTO> queryable, int? pageIndex, int? pageSize)
        {
            int count = await queryable.CountAsync();
            if (pageIndex is not null && pageSize is not null)
            {
                queryable = queryable.Skip((int)pageIndex * (int)pageSize).Take((int)pageSize);
            }

            return new PaginatedContactsDTO()
            {
                Result = await queryable.ToListAsync(),
                Total = count
            };
        }

        [HttpPost]
        public async Task<ActionResult<ContactDTO>> Post([FromBody]ContactDTO requestContact)
        {
            if (requestContact is null) return BadRequest();

            if(await _context.Contacts.Where(c => c.PhoneNumber == requestContact.PhoneNumber).SingleOrDefaultAsync() is not null)
            {
                return BadRequest("Duplicate phone number");
            }
            var (contactModel, validation) = await requestContact.ToModel(_context);
            if(contactModel is not null && validation.Valid)
            {
                var contact = _context.Contacts.Add(contactModel).Entity;
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(Get), new { id = contact.Id }, contact);
            } else
            {
                return BadRequest(validation);
            }
        }

        [Route("Validate")]
        [HttpPost]
        public async Task<ActionResult<ContactValidation>> Validate([FromBody] ContactDTO requestContact)
        {
            if (requestContact is null) return BadRequest();
            requestContact.Id = -1; //Ensure id doesn't affect logic
            var validation = await requestContact.Validate(_context);
            return Ok(validation);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody]ContactDTO requestContact)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact is null) return NotFound();

            contact.FirstName = requestContact.FirstName ?? "";
            contact.LastName = requestContact.LastName ?? "";
            contact.Address = requestContact.Address ?? "";
            contact.PhoneNumber = requestContact.PhoneNumber ?? "";

            var validation = await ContactDTO.FromModel(contact).Validate(_context);
            if (!validation.Valid) return BadRequest(validation);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact is null) return NotFound();

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
