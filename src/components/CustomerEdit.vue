<template>
    <div v-if="props.customer" id="customer-form-container">
        <form @submit.prevent="updateExistingCustomer">
            <fieldset>
                <legend id="edit-form">Edit Form</legend>
                <label>First Name: </label>
                <input v-model="props.customer.first" />
                <label>Last Name: </label>
                <input v-model="props.customer.last" />
                <label>Email: </label>
                <input v-model="props.customer.email" />
                <button id="edit-customer-button" type="submit">
                    <div id="edit-customer-button-text">Update</div>
                </button>
                <button id="cancel-customer-button" type="button">
                    <div id="cancel-customer-button-text" @click="editCancel">Cancel</div>
                </button>
            </fieldset>
        </form>
    </div>
</template>

<script setup>
const props = defineProps({
    customer: Object
});

const emit = defineEmits(['updateCustomer', 'editCancel']);

function updateExistingCustomer() {
    emit("updateCustomer", props.customer);
}

function editCancel() {
    // props.customer = null;
    emit("editCancel");
}
</script>