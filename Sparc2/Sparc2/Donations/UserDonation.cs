namespace Sparc2.Donations;

public class UserDonation(decimal amount, string frequency, string message, PaymentInfo payment) : BlossomEntity<string>(Guid.NewGuid().ToString())
{
    public decimal Amount { get; set; } = amount;
    public string Frequency { get; set; } = frequency;
    public string Message { get; set; } = message;
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public PaymentInfo Payment { get; set; } = payment;

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
