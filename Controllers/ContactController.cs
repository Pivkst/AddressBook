using System.Reflection.Metadata.Ecma335;
using AddressBook.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<List<ContactDTO>>> Get([FromQuery(Name = "pageindex")] int? pageIndex, [FromQuery(Name = "pagesize")] int? pageSize)
        {
            var queryable = _context.Contacts.OrderBy(a => a.Id).Select(a => ContactDTO.FromModel(a));

            if(pageIndex is not null && pageSize is not null)
            {
                queryable = queryable.Skip((int)pageIndex).Take((int)pageSize);
            }

            return Ok(await queryable.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ContactDTO>> GetId(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact is null) return NotFound();

            return Ok(ContactDTO.FromModel(contact));
        }

        [Route("Search")]
        [HttpPost]
        public async Task<ActionResult<List<ContactDTO>>> SearchFirstName([FromBody] ContactSearchDTO queryContact)
        {
            if (queryContact.PhoneNumber is not null)
            {
                var contact = await _context.Contacts.Where(c => c.PhoneNumber == queryContact.PhoneNumber).SingleOrDefaultAsync();
                if (contact is null) return Ok(new List<ContactDTO>());
                return Ok(new List<ContactDTO>() { ContactDTO.FromModel(contact) });
            }
            var queryable = _context.Contacts.Where(a =>
                a.FirstName.Contains(queryContact.FirstName ?? "") &&
                a.Lastname.Contains(queryContact.Lastname ?? "") &&
                a.Address.Contains(queryContact.Address ?? ""))
                .Select(a => ContactDTO.FromModel(a));

            if (queryContact.pageIndex is not null && queryContact.pageSize is not null)
            {
                queryable = queryable.Skip((int)queryContact.pageIndex).Take((int)queryContact.pageSize);
            }

            return Ok(await queryable.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<ContactDTO>> Post([FromBody]ContactDTO requestContact)
        {
            if (requestContact is null) return BadRequest();

            if(await _context.Contacts.Where(c => c.PhoneNumber == requestContact.PhoneNumber).SingleOrDefaultAsync() is not null)
            {
                return BadRequest("Duplicate phone number");
            }
            var (contactModel, validation) = requestContact.ToModel();
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

        [HttpPut("{id}")]
        public async Task<ActionResult<ContactDTO>> Put(int id, [FromBody]ContactDTO requestContact)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact is null) return NotFound();

            contact.FirstName = requestContact.FirstName ?? "";
            contact.Lastname = requestContact.Lastname ?? "";
            contact.Address = requestContact.Address ?? "";
            contact.PhoneNumber = requestContact.PhoneNumber ?? ""; 
            await _context.SaveChangesAsync();

            return Ok(requestContact);
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
