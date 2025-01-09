<template>
  <div>
    <h1>Add New Product</h1>
    <q-form @submit="addProduct">
      <!-- Product Name -->
      <q-input v-model="productName" label="Product Name" />

      <!-- Product Description -->
      <q-input
        v-model="productDescription"
        type="textarea"
        label="Product Description"
      />

      <!-- Product Price -->
      <q-input v-model="productPrice" type="number" label="Product Price" />

      <!-- Product Currency -->
      <q-select
        v-model="productCurrency"
        :options="currencies"
        label="Product Currency"
        emit-value
        map-options
        filled
      />

      <q-btn label="Save" type="submit" color="primary" :loading="loading" />
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const locale = useLocale();

const localePath = useLocalePath();

const loading = ref(false);
const productName = ref('');
const productDescription = ref('');
const productPrice = ref('');
const productCurrency = ref('');

const addProduct = async () => {
  loading.value = true;
  try {
    // Make API request to add new product
    const response = await $fetch(
      `/api/${locale}/farm/${route.params.farmSlug}/product/new`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productName.value,
          description: productDescription.value,
          price: productPrice.value,
          currency: productCurrency.value,
        }),
      },
    );
    loading.value = false;

    if (response.statusCode === 200) {
      // Assuming the server returns the ID of the newly created product
      const newProductUrl = localePath(
        `/farm/${route.params.farmSlug}/product/${response.body.product.id}`,
      );

      // Redirect to edit page where images can be uploaded
      router.push(newProductUrl);
    } else {
      console.error('Failed to add product:', response.error);
    }
  } catch (error) {
    console.error('Error adding product:', error);
  }
};
</script>
