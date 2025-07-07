namespace Sparc.Store.Donations;

public class PaymentInfo(string cardHolderName, string cardNumber, string expiryDate, string cvv, string emailAdress, string billingAddress, string city, string zipCode, string donationId)
{
    public string CardHolderName { get; set; } = cardHolderName;
    public string CardNumber { get; set; } = cardNumber;
    public string ExpiryDate { get; set; } = expiryDate;
    public string CVV { get; set; } = cvv;
    public string EmailAdress { get; set; } = emailAdress;
    public string BillingAddress { get; set; } = billingAddress;
    public string City { get; set; } = city;
    public string ZipCode { get; set; } = zipCode;
    public string DonationId { get; set; } = donationId;
}
