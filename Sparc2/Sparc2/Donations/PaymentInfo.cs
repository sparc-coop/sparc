namespace Sparc2.Donations;

public class PaymentInfo
{
    public string DonorNameOnTheCard { get; set; }
    public string CardNumber { get; set; }
    public DateTime ExpiryDate { get; set; } 
    public string CVV { get; set; } 
    public string EmailAdress { get; set; }
    public string BillingAddress { get; set; }
    public string DonationId { get; set; }
    public Donation Donation { get; set; }

    public PaymentInfo(string donorNameOnTheCard, string cardNumber, DateTime expiryDate, string cvv, string emailAdress, string billingAddress, string donationId)
    {
        DonorNameOnTheCard = donorNameOnTheCard;
        CardNumber = cardNumber;
        ExpiryDate = expiryDate;
        CVV = cvv;
        EmailAdress = emailAdress;
        BillingAddress = billingAddress;
        DonationId = donationId;
    }   
}
