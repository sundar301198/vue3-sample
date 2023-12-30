<!-- src/components/CustomerForm.vue -->
<template>
    <div id="customer-form-container">
        <form @submit.prevent="addNewCustomer">
            <fieldset>
                <legend id="details-form">Customer Details Form</legend>
                <label>ID: </label>
                <input v-model="newCustomer.id" />
                <label>First Name: </label>
                <input v-model="newCustomer.first" />
                <label>Last Name: </label>
                <input v-model="newCustomer.last" />
                <label>Email: </label>
                <input v-model="newCustomer.email" />
                <label>Created Date: </label>
                <input v-model="newCustomer.created_at" />
                <button id="add-customer-button" type="submit">
                    <div id="add-customer-button-text">Add</div>
                </button>
                <button id="clear-customer-button" type="button">
                    <div id="clear-customer-button-text" @click="clear">Clear</div>
                </button>
            </fieldset>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
const emit = defineEmits(['addCustomer']);
const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const day = today.getDate().toString().padStart(2, '0');
let newCustomer = ref({ id: "", first: "", last: "", email: "", created_at: `${day}-${month}-${year}` });

function addNewCustomer() {
    emit("addCustomer", newCustomer.value);
}

function clear() {
    newCustomer.value = { id: "", first: "", last: "", email: "", created_at: `${day}-${month}-${year}` };
}

defineExpose({
    clear
});
</script>