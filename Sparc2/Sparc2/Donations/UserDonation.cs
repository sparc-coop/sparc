namespace Sparc2.Donations;

public class UserDonation : BlossomEntity<string>
{
    public decimal Amount { get; set; }
    public string Frequency { get; set; }
    public DateTime DateCreated { get; set; }
    public PaymentInfo Payment { get; set; }

    public UserDonation(decimal amount, string frequency, PaymentInfo payment) : base(Guid.NewGuid().ToString())
    {
        Amount = amount;
        Frequency = frequency;
        DateCreated = DateTime.UtcNow;
        Payment = payment;
    }

    public void UpdateDonation(decimal newAmount, string newFrequency)
    {
        Amount = newAmount;
        Frequency = newFrequency;
    }
}

public enum DonationFrequency
{
    OneTime,
    Monthly
}
