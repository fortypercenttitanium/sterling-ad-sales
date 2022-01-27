module.exports = function generateVendorEmail({
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
          <h1 class="success-title">A customer has purchased an ad!</h1>
          <h3 class="details">Details:</h3>
          <p>Order number: ${orderNumber}</p>
          Name: ${name}<br />
          Company: ${company}<br />
          Amount total: ${price_formatted}<br />
          Ad type: ${adName}<br />
          Ad text (if eighth page): ${adText}<br />
          Student seller: ${student}<br />
          Notes: ${notes}</p>
        </div>
      </body>
    </html>
`;
};
