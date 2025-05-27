namespace Sparc2.Donations;

public class UserDonation : BlossomEntity<string>
{
    public decimal Amount { get; set; }
    public string Frequency { get; set; }
    public string Message { get; set; }
    public DateTime DateCreated { get; set; }
    public PaymentInfo Payment { get; set; }

    public UserDonation(decimal amount, string frequency, string message, PaymentInfo payment) : base(Guid.NewGuid().ToString())
    {
        Amount = amount;
        Frequency = frequency;
        Message = message;
        DateCreated = DateTime.UtcNow;
        Payment = payment;
    }

    public void UpdateDonation(decimal newAmount, string newFrequency, string newMessage)
    {
        Amount = newAmount;
        Frequency = newFrequency;
        Message = newMessage;
    }
}

public enum DonationFrequency
{
    OneTime,
    Monthly
}
