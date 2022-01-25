const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
require('dotenv').config();
const adDetails = require('../adDetails.json');
const { addLogEntry, getAdCoverAvailability } = require('./db/db');

const PORT = process.env.PORT || 8000;
const STRIPE_SECRET_KEY =
  process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_TEST_KEY;

const stripe = require('stripe')(STRIPE_SECRET_KEY);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.post('/checkout', async (req, res) => {
  const adFile = req.files?.['ad-content-file'];
  const fileSizeLimit = 1048756 * 10;
  const acceptedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'svg', 'gif'];

  // validate ad file
  if (adFile) {
    const split = adFile.name.split('.');
    if (split.length < 2) return badRequest('Invalid file name/extension');

    const fileExt = split[split.length - 1];
    const fileName = split[0];

    // validate size
    if (adFile.size > fileSizeLimit)
      return badRequest(
        `File size too large. File must be less than ${
          fileSizeLimit / 1048756
        }MB.`,
      );

    // validate extension
    if (!acceptedExtensions.includes(fileExt))
      return badRequest(
        `Invalid file extension: ${fileExt}. File extension must be one of: ${acceptedExtensions.toString()}`,
      );
    // TODO
    // if cover, check if available
  }

  const adInfo = adDetails[req.body['ad-size']];

  if (!adInfo) return badRequest('Invalid ad type chosen\n');

  const { name, price, description, limited } = adInfo;
  const { notes, company, student } = req.body;

  // create order id

  // todo use metadata to store other info like notes
  // create stripe session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name,
          },
          unit_amount: price * 100,
        },
        quantity: 1,
        description,
      },
    ],
    allow_promotion_codes: true,
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/success`,
    cancel_url: `${req.protocol}://${req.get('host')}`,
  });

  res.redirect(303, session.url);

  function badRequest(message) {
    res.status(400).send(message);
  }
});

app.get('/adAvailability', async (req, res) => {
  res.json(await getAdCoverAvailability());
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
