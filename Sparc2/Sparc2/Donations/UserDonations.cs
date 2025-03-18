namespace Sparc2.Donations;

public class UserDonations(BlossomAggregateOptions<UserDonation> options) : BlossomAggregate<UserDonation>(options)
{
    public BlossomQuery<UserDonation> GetAllDonations()
        => Query().OrderByDescending(x => x.DateCreated);

    public BlossomQuery<UserDonation> GetDonationsByEmail(string email)
        => Query().Where(x => x.Payment.EmailAdress == email);

    public BlossomQuery<UserDonation> GetDonationsByAmount(decimal minAmount, decimal maxAmount)
        => Query().Where(x => x.Amount >= minAmount && x.Amount <= maxAmount);

    public BlossomQuery<UserDonation> GetDonationsByFrequency(DonationFrequency frequency)
        => Query().Where(x => x.Frequency == frequency.ToString());
}
