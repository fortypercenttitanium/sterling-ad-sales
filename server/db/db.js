const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const adDetails = require('../../adDetails.json');
require('dotenv').config();

initializeApp();
const db = getFirestore();

const adTypes = Object.keys(adDetails);

// calculate the current school year - this will help store the data in the correct collection
const date = new Date();
const thisYear = date.getFullYear();
const schoolYear = date.getMonth() < 8 ? thisYear : thisYear + 1;

// create an order number (generated dynamically)
async function generateNextOrderNumber() {
  // reference the current school year collection
  const ref = await db.collection(schoolYear.toString());

  // get the next order number
  const lastOrder = await ref.orderBy('orderNumber', 'desc').limit(1).get();

  // prepend school year to order number
  let orderNumber = `${schoolYear.toString()}-`;

  if (lastOrder.empty) {
    orderNumber += '001';
  } else {
    const lastOrderNumber = lastOrder.docs[0].id;

    // get the next number
    let nextOrderNumber = (
      Number(lastOrderNumber.split('-').pop()) + 1
    ).toString();
    // prepend 0s to beginning of number
    while (nextOrderNumber.length < 3) {
      nextOrderNumber = '0' + nextOrderNumber;
    }

    orderNumber += nextOrderNumber;
  }

  await ref.doc(orderNumber).set({ orderNumber });

  return orderNumber;
}

async function addLogEntry({
  name,
  size,
  price,
  company,
  notes,
  student,
  orderNumber,
}) {
  try {
    // validate data
    [name, size].forEach((property) => {
      if (typeof property !== 'string') {
        throw new Error(
          `Invalid type for property "name" or "size". Expected string, received ${property}.`,
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

    [company, notes, student].forEach((property) => {
      if (typeof property !== 'string' && typeof property !== 'null') {
        throw new Error(
          `Invalid type for property "company", "name", or "student". Expected string or null, received ${property}.`,
        );
      }
    });

    const timestamp = Timestamp.now();

    // reference the current school year collection
    const ref = await db.collection(schoolYear.toString());

    await ref.doc(orderNumber).set({
      name,
      size,
      price,
      company,
      notes,
      student,
      timestamp,
      orderNumber,
    });

    return orderNumber;
  } catch (err) {
    throw new Error(err);
  }
}

async function getAdCoverAvailability() {
  // reference the current school year collection
  const ref = await db.collection(schoolYear.toString());

  // return an array of limited ads that are still available
  const limitedAdTypes = adTypes.filter((type) => adDetails[type].limited);

  const query = await ref.get();
  const allSales = query.docs.map((doc) => doc.data());

  const availableCovers = limitedAdTypes.filter(
    (adType) => !allSales.some((sale) => sale.size === adType),
  );
  return availableCovers;
}

module.exports = {
  addLogEntry,
  getAdCoverAvailability,
  generateNextOrderNumber,
};
