namespace Sparc2.Donations;

public class Donation : BlossomEntity<string>
{
    public decimal Amount { get; set; } 
    public DonationFrequency Frequency { get; set; } 
    public DateTime DateCreated { get; set; }
    public PaymentInfo Payment { get; set; }

    public Donation(decimal amount, DonationFrequency frequency, PaymentInfo payment) : base(Guid.NewGuid().ToString())
    {
        Amount = amount;
        Frequency = frequency;
        DateCreated = DateTime.UtcNow;
        Payment = payment;
    }
}

public enum DonationFrequency
{
    OneTime,
    Monthly
}

