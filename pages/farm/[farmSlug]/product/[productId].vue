<template>
  <div>
    <h1>Edit Product</h1>
    <q-form @submit.prevent="updateProduct">
      <!-- Product Name -->
      <q-input v-model="productName" label="Product Name" />

      <!-- Product Description -->
      <h2>Product Description</h2>

      <tiptap-editor v-model="productDescription" />

      <q-checkbox v-model="translateAll" label="Translate to all languages" />

      <!-- Product Price -->
      <q-input
        v-model.number="productPrice"
        type="number"
        label="Product Price"
        step="0.01"
        @blur="formatPrice"
      />

      <!-- Product Currency -->
      <q-select
        v-model="productCurrency"
        :options="currencies"
        label="Product Currency"
        emit-value
        map-options
        filled
      />

      <!-- Images -->
      <h2>Images</h2>
      <ImageUploader
        :entityType="'product'"
        :entityId="productId"
        :mediaFiles="productMediaFiles"
        @updateMediaFiles="handleMediaFilesUpdate"
      />

      <div class="row justify-between">
        <q-btn
          rounded
          label="Delete"
          color="negative"
          :loading="loading"
          @click="deleteProduct"
        />
        <q-btn
          rounded
          label="Save"
          type="submit"
          color="primary"
          :loading="loading"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const locale = useLocale();
const { data } = useAuth();

const { t } = useI18n();

const localePath = useLocalePath();

const translateAll = ref(false);

const loading = ref(false);
const productId = route.params.productId;

const productName = ref('');
const productDescription = ref('');
const productPrice = ref(0.0); // Default to 0.0 to emphasize float usage
const productCurrency = ref('');
const productMediaFiles = ref([]);

definePageMeta({ middleware: 'auth' });

const fetchProductData = async () => {
  try {
    const product = await $fetch(
      `/api/${locale}/farm/${route.params.farmSlug}/product/${productId}`,
    );

    if (data.value.user?.id !== product.body.product.farmOwnerId) {
      navigateTo(localePath(`${locale}/farm/${route.params.farmSlug}`));
    }

    // Initialize the product data
    productName.value = product.body.product.name;
    productDescription.value = product.body.product.description;
    productPrice.value = parseFloat(product.body.product.price); // Ensure float conversion
    productCurrency.value = product.body.product.currency;
    productMediaFiles.value = product.body.product.mediaFiles || [];
  } catch (error) {
    navigateTo(localePath(`${locale}/farm/${route.params.farmSlug}`));

    console.error('Error fetching product data:', error);
  }
};

onMounted(async () => {
  // Fetch product data
  await fetchProductData();
});

const handleMediaFilesUpdate = (updatedFiles, action) => {
  if (['add', 'sort', 'delete'].includes(action)) {
    productMediaFiles.value = updatedFiles;
  }
};

const updateProduct = async () => {
  loading.value = true;
  try {
    // Make API request to update product using $fetch
    await $fetch(
      `/api/${locale}/farm/${route.params.farmSlug}/product/${productId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name: productName.value,
          description: productDescription.value,
          price: parseFloat(productPrice.value), // Ensure sending as float
          currency: productCurrency.value,
          mediaFiles: productMediaFiles.value,
          translateAll: translateAll.value,
        },
      },
    );

    loading.value = false;
    // Product updated successfully, redirect to farm profile page
    router.push(localePath(`/farm/${route.params.farmSlug}/edit`));
  } catch (error) {
    console.error('Error updating product:', error);
    loading.value = false;
  }
};

const deleteProduct = async () => {
  try {
    const confirmed = await confirmDialog({
      title: t('delete_product'),
      description: t('are_you_sure_you_want_to_delete_this_product_it_ca'),
      okLabel: t('yes'),
      cancelLabel: t('no'),
    });

    if (!confirmed) {
      return;
    }

    loading.value = true;
    // Make API request to delete product
    await $fetch(
      `/api/${locale}/farm/${route.params.farmSlug}/product/${productId}`,
      {
        method: 'DELETE',
      },
    );

    loading.value = false;
    // Product deleted successfully, redirect to farm profile page
    router.push(localePath(`/farm/${route.params.farmSlug}/edit`));
  } catch (error) {
    console.error('Error deleting product:', error);
    loading.value = false;
  }
};

const formatPrice = () => {
  productPrice.value = parseFloat(productPrice.value).toFixed(2);
};
</script>

<style lang="scss" scoped>
/* Add any styles specific to the product edit page here */
</style>
