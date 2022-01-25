module.exports = function successPageGenerator(session) {
  const { amount_total, customer_details, metadata } = session;
  const { email } = customer_details;
  const { notes, company, student, orderNumber, name, adType } = metadata;
  const amount_formatted = (amount_total / 100).toFixed(2);
  const contact_email = process.env.CONTACT_EMAIL;

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
          Email: ${email}<br />
          Amount total: $${amount_formatted}<br />
          Ad type: ${adType}<br />
          Student seller: ${student}<br />
          Notes: ${notes}</p>
          <p class="questions">
            Questions or concerns?<br />
            <a href="mailto:${contact_email}">Please contact us.</a>
          </p>
          <p><a href="/">Return to main page</a></p>
        </div>
      </body>
    </html>
`;
};
