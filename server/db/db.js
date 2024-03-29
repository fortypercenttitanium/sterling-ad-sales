require('dotenv').config();
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const adDetails = require('../../adDetails.json');

initializeApp({
  storageBucket: 'sterling-ad-sales.appspot.com',
});
const db = getFirestore();
const storage = getStorage().bucket();

const adTypes = Object.keys(adDetails);

// calculate the current school year - this will help store the data in the correct collection
const date = new Date();
const thisYear = date.getFullYear();
const schoolYear = (date.getMonth() < 8 ? thisYear : thisYear + 1).toString();

// create an order number (generated dynamically)
async function generateNextOrderNumber() {
  // reference the current school year collection
  const ref = await db.collection(schoolYear);

  // get the next order number
  const lastOrder = await ref.orderBy('orderNumber', 'desc').limit(1).get();

  // prepend school year to order number
  let orderNumber = `${schoolYear}-`;

  if (lastOrder.empty) {
    orderNumber += '0001';
  } else {
    const lastOrderNumber = lastOrder.docs[0].id;

    // get the next number
    let nextOrderNumber = (
      Number(lastOrderNumber.split('-').pop()) + 1
    ).toString();
    // prepend 0s to beginning of number
    while (nextOrderNumber.length < 4) {
      nextOrderNumber = '0' + nextOrderNumber;
    }

    orderNumber += nextOrderNumber;
  }

  await ref.doc(orderNumber).set({ orderNumber });

  return orderNumber;
}

async function addLogEntry(details) {
  try {
    const {
      name,
      size,
      price,
      company,
      notes,
      student,
      orderNumber,
      customerEmail,
      adText,
      adFileName,
      adName,
    } = details;

    // validate data
    [name, size, customerEmail].forEach((property) => {
      if (typeof property !== 'string') {
        throw new Error(
          `Invalid type for property "name", "size", or "email". Expected string, received ${property}.`,
        );
      }
    });

    if (!adTypes.includes(size))
      throw new Error(
        `Invalid ad size ${size}. Expect one of ${adTypes.toString()}`,
      );

    if (typeof price !== 'number') {
      throw new Error(
        `Invalid type for property "price". Expected number, received ${property}.`,
      );
    }

    ['company', 'notes', 'student', 'adText', 'adFileName', 'adName'].forEach(
      (property) => {
        if (
          typeof details[property] !== 'string' &&
          typeof details[property] !== 'null'
        ) {
          throw new Error(
            `Invalid type for property ${property}. Expected string or null, received ${details[property]}.`,
          );
        }
      },
    );

    const timestamp = Timestamp.now();

    // reference the current school year collection
    const ref = await db.collection(schoolYear);

    await ref.doc(orderNumber).set({
      name,
      size,
      price,
      company,
      notes,
      student,
      timestamp,
      orderNumber,
      email: customerEmail,
      confirmationEmailSent: false,
      adText,
      adFileName,
      adName,
    });

    return orderNumber;
  } catch (err) {
    throw new Error(err);
  }
}

async function checkIfConfirmationSent(orderNumber) {
  // reference the current school year collection
  const ref = await db.collection(schoolYear);
  const order = await ref.doc(orderNumber).get();
  return await order.data().confirmationEmailSent;
}

async function setConfirmationSent(orderNumber) {
  // reference the current school year collection
  const ref = await db.collection(schoolYear);

  await ref.doc(orderNumber).set(
    {
      confirmationEmailSent: true,
    },
    { merge: true },
  );
}

async function getAdCoverAvailability() {
  try {
    // reference the current school year collection
    const ref = await db.collection(schoolYear);

    // return an array of limited ads that are still available
    const limitedAdTypes = adTypes.filter((type) => adDetails[type].limited);

    const query = await ref.get();
    const allSales = query.docs.map((doc) => doc.data());

    const availableCovers = limitedAdTypes.filter(
      (adType) => !allSales.some((sale) => sale.size === adType),
    );
    return availableCovers;
  } catch (err) {
    console.error(err);
  }
}

async function uploadFile(fileName, data) {
  try {
    const file = storage.file(fileName);
    await file.save(data);
  } catch (err) {
    console.error(err);
  }
}

async function downloadFile(name) {
  try {
    const file = await storage.file(name).download();
    return file;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  addLogEntry,
  getAdCoverAvailability,
  generateNextOrderNumber,
  uploadFile,
  downloadFile,
  checkIfConfirmationSent,
  setConfirmationSent,
};
