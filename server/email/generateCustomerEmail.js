module.exports = function generateCustomerEmail({
  name,
  adName,
  price,
  company,
  notes,
  student,
  orderNumber,
  adText,
}) {
  const price_formatted = (price / 100).toFixed(2);
  return `
  <!DOCTYPE html>
    <html lang="en">
      <body>
        <div class="success-body">
          <h1 class="success-title">Thank you for your ad purchase!</h1>
          <h2 class="success-subtitle">
            The proceeds for this purchase will go toward helping our program grow and provide scholarships for our students!
          </h2>
          <h3 class="details">Details:</h3>
          <p>Order number: ${orderNumber}</p>
          Name: ${name}<br />
          Company: ${company}<br />
          Amount total: ${price_formatted}<br />
          Ad type: ${adName}<br />
          Ad text (if eighth page): ${adText}<br />
          Student seller: ${student}<br />
          Notes: ${notes}</p>
          <p class="questions">
            <a href="mailto:${process.env.CONTACT_EMAIL}">Please contact us</a> with any questions. Do not reply directly to this email, as it is not monitored for incoming emails.
          </p>
        </div>
      </body>
    </html>
`;
};
