<template>
  <q-card class="text-center rounded-card q-pa-lg" style="width: 350px">
    <h2 class="q-ma-none">{{ $t('log_in_or_sign_up') }}</h2>
    <div class="text-body1 text-black-olive">
      {{ $t('lets_get_back_to_the_roots_together') }}
    </div>
    <q-form class="q-pa-md" @submit.prevent="onSubmit">
      <div class="q-mt-none">
        <div class="q-my-none row justify-center">
          <q-btn
            flat
            round
            size="lg"
            icon="img:/img/icons/facebook.svg"
            @click="socialAction('github')"
          ></q-btn>
          <q-btn
            flat
            round
            size="lg"
            icon="img:/img/icons/google.svg"
            @click="socialAction('google')"
          ></q-btn>
          <q-btn
            flat
            round
            size="lg"
            icon="img:/img/icons/linkedin.svg"
            @click="socialAction('google')"
          ></q-btn>
          <q-btn
            flat
            round
            size="lg"
            icon="img:/img/icons/twitter-x.svg"
            @click="socialAction('google')"
          ></q-btn>
        </div>
      </div>
      <div class="flex row no-wrap justify-center items-center q-mb-md">
        <hr width="100%" color="black-olive" />
        <span class="q-px-md">{{ $t('or') }}</span>
        <hr width="100%" color="black-olive" />
      </div>

      <q-input
        v-model="email"
        label="Email"
        required
        outlined
        :rules="[(val) => rules.isValidEmail(val) || $t('invalid_email')]"
        :disable="isLoading"
      ></q-input>
      <div class="q-mt-md">
        <q-btn
          rounded
          color="primary"
          :loading="isLoading"
          type="submit"
          size="lg"
          class="full-width"
        >
          {{ $t('continue') }}
        </q-btn>
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();

const email = ref('');
const isLoading = ref(false);
const { signIn } = useAuth();
const emit = defineEmits(['success']);

const onSubmit = async () => {
  isLoading.value = true;
  try {
    const result = await signIn('email', {
      email: email.value,
      redirect: false, // Depends on your auth provider
    });
    if (result?.ok && !result.error) {
      $q.notify({
        type: 'positive',
        message: `Check your email for the magic link!`,
      });
      console.log('Check your email for the magic link!');
      emit('success', result);
    } else {
      console.log('Something went wrong');
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const socialAction = async (provider: string) => {
  isLoading.value = true;
  try {
    await signIn(provider, { redirect: false });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
hr {
  border: none;
  background-color: unset;
  border-top: 1px solid $black-olive;
}
</style>
