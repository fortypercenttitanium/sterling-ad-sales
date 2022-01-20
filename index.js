const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8000;

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

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
