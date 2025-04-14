namespace Sparc2.Donations;

public class PaymentInfo
{
    public string CardHolderName { get; set; }
    public string CardNumber { get; set; }
    public string ExpiryDate { get; set; } 
    public string CVV { get; set; } 
    public string EmailAdress { get; set; }
    public string BillingAddress { get; set; }
    public string City { get; set; }
    public string ZipCode { get; set; }
    public string DonationId { get; set; }
    public UserDonation Donation { get; set; }

    public PaymentInfo(string cardHolderName, string cardNumber, string expiryDate, string cvv, string emailAdress, string billingAddress, string city, string zipCode, string donationId)
    {
        CardHolderName = cardHolderName;
        CardNumber = cardNumber;
        ExpiryDate = expiryDate;
        CVV = cvv;
        EmailAdress = emailAdress;
        BillingAddress = billingAddress;
        City = city;
        ZipCode = zipCode;
        DonationId = donationId;
    }   
}
