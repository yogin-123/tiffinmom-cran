const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "9bvqg4tfsx7rd8t4",
  publicKey: "w2sn9gbng5bs3zf4",
  privateKey: "b42ba60e60a4dbd07dd5616bb831b950",
});

exports.getGenerateToken = (req, res) => {
  gateway.clientToken
    .generate({})
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => res.status(500).send(error));
};

exports.processPayment = (req, res) => {
  console.log(req);
  const nonceFromTheClient = req.body.payment_method_nonce;
  const { amount } = req.body;

  gateway.transaction
    .sale({
      amount: amount,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    })
    .then((result) => res.status(200).send(result))
    .catch((error) => res.status(500).send(error));
};
