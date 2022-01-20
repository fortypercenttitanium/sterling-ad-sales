# Ad sale form

## Frontend

- Serve form
- Success/error messages
- Send form data to server

## Backend

- Serve:

  - index.html (method: ANY)

    - Form
      - Name!
      - Company
      - Email!
      - Phone!
      - Student seller!
      - Ad size!
        - Disable if doing projections
        - Full, Half, Quarter, Eighth
      - Select component
        - Ad file (full/half/quarter)
        - Ad text (eighth - 75 char limit, no artwork or pictures)
      - Payment info!
        - Credit
        - Paypal
      - Promotional code
      - Notes
    - Issues? Contact (email).
    - Display show details/dates/times
    - Display ad submission deadline
    - Flash message

  - success.html (method: ANY)
    - Link back to index
  - failure.html (method: ANY)
    - Link back to index
  - offline.html (method: ANY)
    - if a certain date has passed, only serve offline mode
  - /submit (method: POST)

- Form handler:

  - POST
  - Validate data
  - Accept payment
  - Assign confirmation number (db)
  - Send confirmation email
    - Further instructions?
    - Receipt
  - Send email to admin
    - Provide all details
    - Include file of ad
  - Log record in database
  - Redirect to success or failure route

### Questions

- Include address?
- How to handle covers
  - Could store availability in database
- Pricing
