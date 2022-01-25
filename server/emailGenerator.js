module.exports = function emailGenerator(session) {
  const { amount_total, customer_details, metadata } = session;
  const { email } = customer_details;
  const { notes, company, student, orderNumber, name, adType } = metadata;

  return `
  <!DOCTYPE html>
    <html lang="en">
      <body>
        <div class="success-body">
          <h1 class="success-title">Success!</h1>
          <h2 class="success-subtitle">
            Your ad was purchased successfully. You should receive an email receipt
            shortly.
          </h2>
          <h3 class="details">Details:</h3>
          <p>Order number: ${orderNumber}</p>
          Name: ${name}<br />>
          Company: ${company}<br />
          Email: ${email}<br />
          Amount total: ${amount_total}<br />
          Ad type: ${adType}<br />
          Student seller: ${student}<br />
          Notes: ${notes}</p>
          <p class="questions">
            Questions or concerns?<br />
            <a href="mailto:sterlingadsales@gmail.com">Please contact us.</a>
          </p>
          <p><a href="/">Return to main page</a></p>
        </div>
      </body>
    </html>
`;
};
