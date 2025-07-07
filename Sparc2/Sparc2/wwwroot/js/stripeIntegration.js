window.stripeIntegration = {
    initPaymentForm: async function (clientSecret, publishableKey, dotNetHelper, baseUrl) {
        document.getElementById("payment-element").innerHTML = "";
        if (window._lastPaymentElement) {
            try { window._lastPaymentElement.unmount(); }
            catch (__) {  }
        }
        console.log("initPaymentForm called with:", clientSecret, publishableKey, dotNetHelper, baseUrl);

        if (!dotNetHelper) {
            console.error("DotNet helper object not provided to initPaymentForm.");
            return;
        }

        window.clientSecret = clientSecret;
        window.baseUrl = baseUrl;
        window.publishableKey = publishableKey;
        window.stripe = Stripe(publishableKey);
        window.elements = stripe.elements({
            clientSecret: clientSecret,
        });

        window.paymentElement = elements.create("payment");

        paymentElement.mount("#payment-element");

        window._lastPaymentElement = paymentElement;

        const form = document.getElementById("payment-form");
        const submitButton = document.getElementById("submit-button");
        const errorMessageDiv = document.getElementById("error-message");

        console.log("Stripe element: ", paymentElement);
    },

    confirmPayment: async function () {
        let elements = window.elements;
        let stripe = window.stripe;
        let clientsecret = window.clientSecret;
        let baseUrl = window.baseUrl;

        const { error: submitError } = await elements.submit();
        if (submitError) {
            console.error("Elements submit error:", submitError);
            errorMessageDiv.textContent = submitError.message;
            submitButton.disabled = false;
            return;
        }
        console.log("Elements submitted successfully. Confirming payment...");

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: { return_url: baseUrl + "payment-success" },
            redirect: "if_required"
        });

        if (error) {
            return { succeeded: false, message: error.message };
        }

        return {
            succeeded: paymentIntent?.status === "succeeded",
            status: paymentIntent?.status
        };
    }
};