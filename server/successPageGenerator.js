module.exports = function successPageGenerator({
  name,
  adName,
  price,
  company,
  notes,
  student,
  orderNumber,
  customerEmail,
}) {
  const price_formatted = (price / 100).toFixed(2);
  const contactEmail = process.env.CONTACT_EMAIL;

  return `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="style.css" />
        <title>Success</title>
      </head>
      <body>
        <div class="success-body">
          <h1 class="success-title">Success!</h1>
          <h2 class="success-subtitle">
            Your ad was purchased successfully. You should receive an email receipt
            shortly.
          </h2>
          <h3 class="details">Details:</h3>
          <p>Order number: ${orderNumber}</p>
          Name: ${name}<br />
          Company: ${company}<br />
          Email: ${customerEmail}<br />
          Amount total: $${price_formatted}<br />
          Ad type: ${adName}<br />
          Student seller: ${student}<br />
          Notes: ${notes}</p>
          <p class="questions">
            Questions or concerns?<br />
            <a href="mailto:${contactEmail}">Please contact us.</a>
          </p>
          <p><a href="/">Return to main page</a></p>
        </div>
      </body>
    </html>
`;
};
