window.stripeIntegration = {
    initPaymentForm: async function (clientSecret, publishableKey, dotNetHelper, baseUrl) {
        console.log("initPaymentForm called with:", clientSecret, publishableKey, dotNetHelper, baseUrl);

        if (!dotNetHelper) {
            console.error("DotNet helper object not provided to initPaymentForm.");
            return;
        }

        const stripe = Stripe(publishableKey);
        var elements = stripe.elements({
            clientSecret: clientSecret,
        });

        var paymentElement = elements.create("payment");

        paymentElement.mount("#payment-element");

        const form = document.getElementById("payment-form");
        const submitButton = document.getElementById("submit-button");
        const errorMessageDiv = document.getElementById("error-message");

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            errorMessageDiv.textContent = "";
            submitButton.disabled = true;

            console.log("Form submitted. Submitting elements...");


            const { error: submitError } = await elements.submit();
            if (submitError) {
                console.error("Elements submit error:", submitError);
                errorMessageDiv.textContent = submitError.message;
                submitButton.disabled = false;
                return;
            }
            console.log("Elements submitted successfully. Confirming payment...");

            const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret: clientSecret,
                confirmParams: {
                    return_url: baseUrl + "payment-success"
                },
                redirect: "if_required"
            });


            if (confirmError) {

                console.error("Stripe confirmPayment error:", confirmError);
                errorMessageDiv.textContent = confirmError.message;
                submitButton.disabled = false;
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                console.log("Payment Succeeded (No Redirect):", paymentIntent);
                try {
                    await dotNetHelper.invokeMethodAsync('HandlePaymentSuccess');
                } catch (e) {
                    console.error("Error invoking .NET method 'HandlePaymentSuccess':", e);
                    errorMessageDiv.textContent = "Payment processed, but failed to update status. Please refresh.";
                }
            } else if (paymentIntent && paymentIntent.status === 'processing') {
                console.log("Payment Processing:", paymentIntent);
                errorMessageDiv.textContent = "Payment is processing. We'll update you when it's complete.";
            } else if (paymentIntent && paymentIntent.status === 'requires_payment_method') {
                console.log("Payment Failed:", paymentIntent);
                errorMessageDiv.textContent = "Payment failed. Please try another payment method.";
                submitButton.disabled = false;
            } else if (paymentIntent) {
                console.log("PaymentIntent status:", paymentIntent.status, paymentIntent);
                errorMessageDiv.textContent = `Payment status: ${paymentIntent.status}. Please check your email or contact support.`;
            } else {
                console.log("Confirmation successful, but no redirect occurred and paymentIntent status unknown.");
                try {
                    await dotNetHelper.invokeMethodAsync('HandlePaymentSuccess');
                } catch (e) {
                    console.error("Error invoking .NET method 'HandlePaymentSuccess':", e);
                    errorMessageDiv.textContent = "Payment processed, but failed to update status. Please refresh.";
                }
            }
        });
    }
};