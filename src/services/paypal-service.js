


const createPaypalPayment = () => {
  const payload = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
  }
}