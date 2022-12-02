const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
require('dotenv').config();
const successPageGenerator = require('./successPageGenerator');
const adDetails = require('../adDetails.json');
const {
  addLogEntry,
  getAdCoverAvailability,
  generateNextOrderNumber,
  uploadFile,
  downloadFile,
  checkIfConfirmationSent,
  setConfirmationSent,
} = require('./db/db');
const sendEmail = require('./email/sendEmail');
const generateCustomerEmail = require('./email/generateCustomerEmail');
const generateVendorEmail = require('./email/generateVendorEmail');

const PORT = process.env.PORT || 8000;
const STRIPE_SECRET_KEY =
  process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_TEST_KEY;

const vendorEmail = process.env.CONTACT_EMAIL;

const stripe = require('stripe')(STRIPE_SECRET_KEY);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.post('/checkout', async (req, res) => {
  try {
    const adFile = req.files?.['ad-content-file'];
    const adText = req.body['ad-content-text'] || '';
    const adType = req.body['ad-size'];
    const adInfo = adDetails[adType];
    let fileExt;
    let adFileName = null;
    const fileSizeLimit = 1048756 * 20;
    const acceptedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'svg', 'gif'];

    const { name: adName, price, description } = adInfo;
    const { notes, company, student, name, email } = req.body;

    const orderNumber = await generateNextOrderNumber();

    if (!adInfo) return badRequest('Invalid ad type chosen\n');

    // validate ad file
    if (adFile) {
      const split = adFile.name.split('.');
      fileExt = split[split.length - 1];
      adFileName = `${orderNumber}.${fileExt}`;

      if (split.length < 2) return badRequest('Invalid file name/extension');

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

      if (adInfo.limited) {
        const availableCovers = await getAdCoverAvailability();

        if (!availableCovers.includes(adType))
          throw new Error(
            `Cannot purchase ad type ${adType}. This limited ad type has already been purchased.`,
          );
      }
    }

    // create stripe session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: adName,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
          description,
        },
      ],
      allow_promotion_codes: true,
      mode: 'payment',
      success_url: `${req.protocol}://${req.get(
        'host',
      )}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}`,
      metadata: {
        notes,
        company,
        student,
        orderNumber,
        name,
        adName,
        description,
        email,
        adType,
        adFileName,
        adText,
      },
    });

    // upload file to storage
    if (adFile) {
      await uploadFile(adFileName, adFile.data);
    }
    res.redirect(303, session.url);

    function badRequest(message) {
      res.status(400).send(message);
    }
  } catch (err) {
    console.error(err);
  }
});

app.get('/adAvailability', async (req, res) => {
  res.json(await getAdCoverAvailability());
});

app.get('/health', (req, res) => res.sendStatus(200));

app.get('/success', async (req, res) => {
  try {
    console.log('Retrieving stripe checkout session...');
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id,
    );
    const {
      notes,
      company,
      student,
      orderNumber,
      name,
      adType,
      email,
      adName,
      adFileName,
      adText,
    } = session.metadata;

    const details = {
      name,
      size: adType,
      price: session.amount_total,
      company,
      notes,
      student,
      orderNumber,
      customerEmail: email,
      adName,
      adText,
      adFileName,
    };

    console.log('Sending success page...');
    res.status(200).send(successPageGenerator(details));

    console.log('Checking if confirmation email was sent...');
    const confirmationSent = await checkIfConfirmationSent(orderNumber);

    if (!confirmationSent) {
      console.log(`Confirmation email for order ${orderNumber} not sent yet.`);
      console.log('Logging checkout details in db...');
      await addLogEntry(details);

      // send email to vendor
      console.log('Sending email to vendor...');

      // check if file is included with purchase
      let attachments = null;

      if (adFileName) {
        const fileData = await downloadFile(adFileName);
        attachments = [
          {
            filename: adFileName,
            content: fileData[0],
          },
        ];
      }

      const vendorInfo = await sendEmail({
        recipient: vendorEmail,
        details,
        subject: `Order #${orderNumber}`,
        html: generateVendorEmail(details),
        attachments,
      });
      console.log('Sending email to customer...');
      const customerInfo = await sendEmail({
        recipient: email,
        details,
        subject: `Receipt for Order #${orderNumber}`,
        html: generateCustomerEmail(details),
      });

      if (!customerInfo || customerInfo.rejected.length)
        return console.log(
          `Failed to send customer email to order #${orderNumber}`,
        );
      if (!vendorInfo || vendorInfo.rejected.length)
        return console.log(
          `Failed to send vendor email to order #${orderNumber}`,
        );

      await setConfirmationSent(orderNumber);
    } else {
      console.log(
        `Confirmation email for order ${orderNumber} has already been sent.`,
      );
    }
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
