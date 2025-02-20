using Microsoft.EntityFrameworkCore;

namespace AddressBook.Data
{
    public class AddressBookDbContext(DbContextOptions<AddressBookDbContext> options) : DbContext(options)
    {
        public DbSet<ContactModel> Contacts => Set<ContactModel>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ContactModel>().HasData(new ContactModel
            {
                Id = 1,
                FirstName = "Bob",
                Lastname = "Jognson",
                Address = "urmomshouse",
                PhoneNumber = "0"
            });
        }
    }
}