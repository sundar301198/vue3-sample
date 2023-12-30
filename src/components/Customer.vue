<template>
    <div id="customer-details-header">
        Customer Details Page
    </div>
    <div id="container">
        <CustomerForm ref="customerFormRef" @addCustomer="addCustomer" />
        <CustomerEdit :customer="selectedCustomer" @updateCustomer="updateCustomer" @editCancel="editCancel" />
    </div>
    <div id="customer-details-actions">
        <form id="customer-details-search">
            <div id="search">Search</div> <input id="query" name="query" v-model="searchQuery"
                placeholder="Search table data">
        </form>
    </div>
    <div id="customer-details-container">
        <table>
            <thead>
                <tr>
                    <th id="table-data-no">S.NO</th>
                    <th id="table-data-id">ID</th>
                    <th id="table-data-email">Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Created Date</th>
                    <th id="table-data-edit">Edit</th>
                    <th id="table-data-delete">Delete</th>
                </tr>
            </thead>
            <tbody class="table-body" v-if="customersDetails.length">
                <tr v-for="(customer, index) in customersDetails" :id="customer.id" :key="customer.id">
                    <td id="table-data-no">{{ index + 1 }}</td>
                    <td id="table-data-id" :value="customer.id">{{ customer.id }}</td>
                    <td id="table-data-email" :value="customer.id">{{ customer.email }}</td>
                    <td :value="customer.id">{{ customer.first }}</td>
                    <td :value="customer.id">{{ customer.last }}</td>
                    <td :value="customer.id">{{ customer.created_at }}</td>
                    <td id="table-data-edit" class="table-data-edit-icon" :value="customer.id"><img id="edit-icon"
                            @click="editCustomer(customer)" :value="customer.id"
                            src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGcgZGF0YS1uYW1lPSJMYXllciAyIj48cGF0aCBkPSJNMTkuNCA3LjM0IDE2LjY2IDQuNkEyIDIgMCAwIDAgMTQgNC41M2wtOSA5YTIgMiAwIDAgMC0uNTcgMS4yMUw0IDE4LjkxYTEgMSAwIDAgMCAuMjkuOEExIDEgMCAwIDAgNSAyMGguMDlsNC4xNy0uMzhhMiAyIDAgMCAwIDEuMjEtLjU3bDktOWExLjkyIDEuOTIgMCAwIDAtLjA3LTIuNzF6TTE2IDEwLjY4IDEzLjMyIDhsMS45NS0yTDE4IDguNzN6IiBkYXRhLW5hbWU9ImVkaXQiLz48L2c+PC9zdmc+">
                    </td>
                    <td id="table-data-delete" class="table-data-delete-icon" :value="customer.id"><img id="delete-icon"
                            @click="deleteCustomer(customer.id)" :value="customer.id"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAvklEQVR4nO3VwQnCMBjF8Qe6hnYRO4FSPNcJ9FxBF9AJdAKdQCcwE9gJdAOPFaFKoFfBvPdJEPuH3JLvR3IJ0PZ5YwAZInQHUH1reNYMfwauin0NR2DvlosFn5ib/1c3g2f2M4IrDeAzAx8N4AMDbw3gDQMvDeAFA08M4JyBUwN4wMB9A7jHwB0ADwH1Z7sguwrwBUIu1uewF+CdAq8FeKXAMwGeKvBIgIcKnACoCbRuzkrNA/9mv7dQ0bbf7wXRGEWDOGx/GAAAAABJRU5ErkJggg==">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, toRefs, reactive, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import CustomerForm from './CustomerForm.vue';
import CustomerEdit from './CustomerEdit.vue';
const customerFormRef = ref("");
let customers = ref([]);
let selectedCustomer = ref(null);
let tempSelectedCustomer = "";
let searchQuery = ref('');

async function fetchCustomers() {
    let response = await axios.get("http://localhost:3000/customers");
    customers.value = response.data;
}

onMounted(() => {
    fetchCustomers();
})

let customersDetails = computed(() => {
    const searchQueryData = searchQuery.value;
    if (searchQueryData) {
        let filterKey = searchQueryData.toLowerCase();
        let data = customers.value.filter((row) => {
            return Object.keys(row).some((key) => {
                return String(row[key]).toLowerCase().indexOf(filterKey) > -1
            })
        })
        return data;
    } else {
        return customers.value;
    }
})

function editCustomer(customer) {
    tempSelectedCustomer = customer;
    selectedCustomer.value = { ...customer };
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Optional: adds smooth scrolling behavior
    });
}

function editCancel() {
    selectedCustomer.value = null;
    tempSelectedCustomer = "";
}

async function updateCustomer(updatedCustomer) {
    let email_status = false;
    if (updatedCustomer.first == "" || updatedCustomer.last == "" || updatedCustomer.email == "") {
        alert("Please fill all the fields");
    } else {
        let email = updatedCustomer.email;
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email");
        } else {
            email_status = true;
        }
    }

    if (tempSelectedCustomer.first == updatedCustomer.first && tempSelectedCustomer.last == updatedCustomer.last && tempSelectedCustomer.email == updatedCustomer.email) {
        alert("Please update the customer details");
    } else if (email_status) {
        await axios.put(`http://localhost:3000/customers/${updatedCustomer.id}`, updatedCustomer).then((response) => {
            if (response.data.status != "failed") {
                fetchCustomers();
                selectedCustomer.value = null;
                tempSelectedCustomer = "";
                alert("Customer Details Updated Successfully");
            } else {
                alert(response.data.message);
            }
        });
    }
}

async function addCustomer(newCustomer) {
    let id_status = false;
    let email_status = false;
    let created_at_status = false;
    if (newCustomer.id == "" || newCustomer.first == "" || newCustomer.last == "" || newCustomer.email == "" || newCustomer.created_at == "") {
        alert("Please fill all the fields");
    } else {
        let id = newCustomer.id;
        let idRegex = /^[0-9]*$/;
        if (!idRegex.test(id)) {
            alert("Please enter a valid id");
        } else {
            id_status = true;
        }

        let email = newCustomer.email;
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email");
        } else {
            email_status = true;
        }

        let created_at = newCustomer.created_at;
        let created_atRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
        if (!created_atRegex.test(created_at)) {
            alert("Please enter date format should be DD-MM-YYYY");
        } else {
            created_at_status = true;
        }
    }
    if (id_status && email_status && created_at_status) {
        await axios.post(`http://localhost:3000/customers/${newCustomer.id}`, newCustomer).then((response) => {
            if (response.data.status != "failed") {
                fetchCustomers();
                customerFormRef.value.clear();
                alert("Customer Details Added Successfully");
            } else {
                alert(response.data.message);
            }
        });
    }
}

async function deleteCustomer(customerId) {
    await axios.delete(`http://localhost:3000/customers/${customerId}`).then(() => {
        fetchCustomers();
    });
    alert("Customer Detail Deleted");
}
</script>

<style>

#container {
    display: flex;
    justify-content: space-between;
}

#query {
    width: 200px;
}

#customer-details-header {
    padding-top: 20px;
    font-weight: 700;
    display: grid;
    position: relative;
    place-content: center;
    font-size: 17px;
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
    padding-top: 25px !important;
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
    padding-top: 0px !important;
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

#table-data-no {
    width: 62px
}

#table-data-id {
    width: 70px
}

#table-data-email {
    width: 280px;
}

#table-data-delete,
#table-data-edit {
    width: 71px;
}

.table-data-delete-icon,
.table-data-edit-icon {
    padding-left: 26px !important;
}

#delete-icon,
#edit-icon {
    cursor: pointer;
    width: 18px;
    height: 18px;
}


/* form */
#customer-form-container {
    display: block;
    width: 50%;
    padding: 20px;
    padding-bottom: 0px !important;
}

#customer-form-header {
    font-weight: 600;
    font-size: 17px;
}

#add-customer-button,
#clear-customer-button,
#edit-customer-button,
#cancel-customer-button {
    margin-right: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
}

#add-customer-button-text,
#clear-customer-button-text,
#edit-customer-button-text,
#cancel-customer-button-text{
    padding: 2px 10px;
    font-size: 14px;
    font-weight: 600;
}

fieldset {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    width: 525px;
}

legend {
    font-size: 16px;
    font-weight: 700;
    color: #42b983;
}

input {
    margin-bottom: 10px;
    padding: 3px;
    width: 100%;
    box-sizing: border-box;
}

label {
    display: inline-block;
    width: 30%;
    text-align: left;
    margin-right: 10px;
    font-size: 14px;
    font-weight: 600;
}
</style>