const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { resolve } = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

let statusDetails = {
  status: "",
  message: ""
};

// Sample customer data
let cust = fs.readFileSync(resolve('./customers.json'), 'utf8');
let parseCust = JSON.parse(cust)

// Get all customers
app.get('/customers', (req, res) => {
  res.json(parseCust);
});

// Get a specific customer by ID
app.get('/customers/:id', (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = parseCust.find(cust => parseInt(cust.id) === customerId);
  if (customer) {
    res.json(customer);
  } else {
    res.status(404).json({ error: 'Customer not found' });
  }
});

// Create a new customer
app.post('/customers/:id', (req, res) => {
  const newCustomer = req.body;
  const customerId = parseInt(req.params.id);
  const customerEmail = req.body.email;
  const customer_id_status = parseCust.find(cust => parseInt(cust.id) === customerId);
  const customer_email_status = parseCust.find(cust => cust.email == customerEmail);

  if (customer_id_status) {
    statusDetails.status = "failed";
    statusDetails.message = "ID already Exists";
    res.json(statusDetails);
  } else if (customer_email_status) {
    statusDetails.status = "failed";
    statusDetails.message = "Email id already Exists";
    res.json(statusDetails);
  } else {
    // Update the JSON file (optional)
    parseCust.push(newCustomer);
    fs.writeFileSync('./customers.json', JSON.stringify(parseCust, null, 2));
    res.json(newCustomer);

  }
});

// Update an existing customer
app.put('/customers/:id', (req, res) => {
  const customerId = parseInt(req.params.id);
  const customerEmail = req.body.email;
  // const customer_email_status = parseCust.find(cust => (parseInt(cust.id) !== customerId ? cust.email == customerEmail : true));
  const customer_email_status = parseCust.find(cust => parseInt(cust.id) === customerId ? false : cust.email == customerEmail);
  const updatedCustomer = req.body;
  if (customer_email_status) {
    statusDetails.status = "failed";
    statusDetails.message = "Email id already Exists";
    res.json(statusDetails);
  } else {
    parseCust = parseCust.map(cust => (parseInt(cust.id) === customerId ? { ...cust, ...updatedCustomer } : cust));
    // Update the JSON file (optional)
    fs.writeFileSync('./customers.json', JSON.stringify(parseCust, null, 2));
    res.json(updatedCustomer);
  }

});

// Delete a customer
app.delete('/customers/:id', (req, res) => {
  const customerId = req.params.id;
  parseCust = parseCust.filter(cust => cust.id != customerId);
  // Update the JSON file (optional)
  fs.writeFileSync('./customers.json', JSON.stringify(parseCust, null, 2));
  res.json({ message: 'Customer deleted successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
