<template>
    <div id="customer-details-header">
        Customer Details Page
    </div>
    <div id="customer-details-actions">
        <form id="customer-details-search">
            <div id="search">Search</div> <input id="query" name="query" v-model="searchQuery"
                placeholder="Search table data">
        </form>
        <div id="delete">
            <button id="delete-btn">Delete</button>
        </div>

    </div>
    <div id="customer-details-container">
        <table>
            <thead>
                <tr>
                    <th id="table-data-id">ID</th>
                    <th id="table-data-email">Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Created Date</th>
                    <th id="table-data-delete">Delete Action</th>
                </tr>
            </thead>
            <tbody class="table-body" v-if="customers.length">
                <tr v-for="customer in customers" :id="customer.id" :key="customer.id">
                    <td id="table-data-id" :value="customer.id">{{ customer.id }}</td>
                    <td id="table-data-email" :value="customer.id">{{ customer.email }}</td>
                    <td :value="customer.id">{{ customer.first }}</td>
                    <td :value="customer.id">{{ customer.last }}</td>
                    <td :value="customer.id">{{ customer.created_at }}</td>
                    <td id="table-data-delete" class="table-data-delete-icon" :value="customer.id"><img id="delete-icon"
                            @click="deleteCustomer(customer)" :value="customer.id"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAvklEQVR4nO3VwQnCMBjF8Qe6hnYRO4FSPNcJ9FxBF9AJdAKdQCcwE9gJdAOPFaFKoFfBvPdJEPuH3JLvR3IJ0PZ5YwAZInQHUH1reNYMfwauin0NR2DvlosFn5ib/1c3g2f2M4IrDeAzAx8N4AMDbw3gDQMvDeAFA08M4JyBUwN4wMB9A7jHwB0ADwH1Z7sguwrwBUIu1uewF+CdAq8FeKXAMwGeKvBIgIcKnACoCbRuzkrNA/9mv7dQ0bbf7wXRGEWDOGx/GAAAAABJRU5ErkJggg==">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import axios from 'axios';
let customers = ref([]);
let selectedCustomer = ref(null);
let tempSelectedCustomer = "";

async function fetchCustomers() {
  let response = await axios.get("http://localhost:3000/customers");
  customers.value = response.data;
}

onMounted(() => {
  fetchCustomers();
})

function editCustomer(customer) {
  tempSelectedCustomer = customer;
  selectedCustomer.value = { ...customer };
}

async function updateCustomer(updatedCustomer) {
  console.log(updatedCustomer);
  console.log(tempSelectedCustomer);
  if(tempSelectedCustomer.first == updatedCustomer.first && tempSelectedCustomer.last == updatedCustomer.last && tempSelectedCustomer.email == updatedCustomer.email) {
    alert("Please update the customer details");
  } else {
    await axios.put(`http://localhost:3000/customers/${updatedCustomer.id}`, updatedCustomer).then(() => {
      fetchCustomers();
      selectedCustomer.value = null;
      tempSelectedCustomer = ""; 
    });
    alert("Customer Details Updated");
  }
}

async function addCustomer(newCustomer) {
  await axios.post("http://localhost:3000/customers", newCustomer).then(() => {
    fetchCustomers();
  });
}

async function deleteCustomer(customerId) {
  await axios.delete(`http://localhost:3000/customers/${customerId}`).then(() => {
    fetchCustomers();
  });
}
</script>

<style>
#query {
    width: 200px;
    height: 25px;
}

#customer-details-header {
    padding-top: 20px;
    font-weight: 600;
    display: grid;
    position: relative;
    place-content: center;
}

#customer-details-actions {
    width: 100%;
    height: 90px;
    display: flex;
}

#delete {
    padding-left: 500px;
    position: relative;
    padding-top: 45px;
}

#delete-btn {
    font-size: 14px;
    width: 83px;
    height: 27px;
}

#customer-details-search {
    display: block;
    width: 50%;
    padding: 20px;
    padding-bottom: 0px !important;
}

#search {
    font-weight: 600;
    font-size: 16px;
}

input::placeholder {
    font-size: 13px;
}

#customer-details-container {
    padding-top: 5px !important;
    padding: 20px;
    position: relative;
    display: grid;
    place-content: center;
}

table {
    border: 2px solid #42b983;
    border-radius: 3px;
    background-color: #fff;
}

th:hover {
    color: rgba(255, 255, 255, 0.66);
}

th {
    background-color: #42b983;
    color: #fff;

    user-select: none;
    padding-bottom: 5px;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
}

tbody {
    display: block;
    height: 350px;
    overflow-y: scroll;
}

thead,
tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
}

tbody tr:hover td,
.td-bg {
    background-color: lightgray;
}

thead {
    width: calc(100% - 1em)
}

td {
    padding: 5px;
    background-color: #f9f9f9;
}

#table-data-id {
    width: 50px
}

#table-data-email {
    width: 280px;
}

#table-data-delete {
    width: 71px;
}

.table-data-delete-icon {
    padding-left: 26px !important;
}

#delete-icon {
    cursor: pointer;
    width: 18px;
    height: 18px;
}
</style>