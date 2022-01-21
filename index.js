const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const STRIPE_SECRET_KEY =
  process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_TEST_KEY;

const stripe = require('stripe')(STRIPE_SECRET_KEY);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'pages')));

app.post('/checkout', (req, res) => {
  const adFile = req.files?.['ad-content-file'];
  const fileSizeLimit = 1048756 * 10;
  // validate ad file
  if (adFile) {
    // validate size
    if (adFile.size > fileSizeLimit)
      res.status(400).send('File size too large');
    // if (!['png, jpg, jpeg, pdf, svg, gif'].includes(adFile.name.split('.')[adFile.name.split('.').length - 1]))
  }
  res.status(200).redirect('/');
});

app.get('/secret', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    description: 'test',
  });

  res.json({ client_secret: paymentIntent.client_secret });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
