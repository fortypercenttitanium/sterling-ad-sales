import adDetails from '../../adDetails.json';

const adSizeSelect = document.querySelector('.ad-size-select');
const adFile = document.querySelector('.ad-content-file-container');
const adText = document.querySelector('.ad-content-text-container');

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('select');
  adText.style.display = 'none';
  adFile.style.display = 'none';

  // populate select options
  const select = document.querySelector('.ad-size-select');

  const adOptions = Object.keys(adDetails).filter(
    (option) => !adDetails[option].limited,
  );

  M.FormSelect.init(elems);

  // get ad cover availability
  fetch('./adAvailability')
    .then((res) => res.json())
    .then((results) => {
      const allOptions = [...adOptions, ...results];

      allOptions.forEach((option) => {
        const details = adDetails[option];
        const el = document.createElement('option');
        el.value = option;
        el.textContent = `${details.name} - $${details.price.toString()}`;
        select.appendChild(el);
      });
    })

    .catch((err) => console.error(err))
    .finally(() => {
      M.updateTextFields();
      M.FormSelect.init(elems);
    });

  M.updateTextFields();
});

adFile.addEventListener('change', (e) => {
  const limitInMb = 10;
  if (e.target.files[0].size > 1048576 * limitInMb) {
    alert(`File must be less than ${limitInMB}MB`);
    e.target.value = '';
  }
});

adSizeSelect.addEventListener('change', (e) => {
  const adTextInput = document.querySelector('#ad-content-text');
  const adFileInput = document.querySelector('#ad-content-file');

  if (e.target.value === 'eighth') {
    // remove file input
    adFile.style.display = 'none';
    adFileInput.setAttribute('required', 'false');
    adFileInput.setAttribute('disabled', 'true');
    adFileInput.value = '';

    // add text input
    adText.style.display = 'block';
    adTextInput.setAttribute('required', 'true');
    adTextInput.removeAttribute('disabled');
  } else {
    // remove text input
    adText.value = '';
    adText.style.display = 'none';
    adTextInput.setAttribute('required', 'false');
    adTextInput.setAttribute('disabled', 'true');

    // add file input
    adFile.style.display = 'flex';
    adFileInput.setAttribute('required', 'true');
    adFileInput.removeAttribute('disabled');
  }

  M.updateTextFields();
});
