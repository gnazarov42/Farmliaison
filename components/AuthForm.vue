<template>
  <q-card class="mx-auto" style="width: 350px">
    <q-form class="q-pa-md" @submit.prevent="onSubmit">
      <q-input
        v-if="variant === 'REGISTER'"
        v-model="name"
        label="Name"
        required
        :disable="isLoading"
      ></q-input>
      <q-input
        v-model="email"
        label="Email"
        required
        :disable="isLoading"
      ></q-input>
      <q-input
        v-model="password"
        label="Password"
        type="password"
        required
        :disable="isLoading"
      ></q-input>

      <div class="q-mt-md">
        <q-btn :loading="isLoading" type="submit" full-width>
          {{ variant === 'LOGIN' ? 'Sign In' : 'Register' }}
        </q-btn>
      </div>

      <div class="q-mt-md">
        Or Continue with:

        <div class="q-my-md row justify-center">
          <q-btn
            flat
            icon="mdi-github"
            :loading="isLoading"
            @click="socialAction('github')"
          ></q-btn>
          <q-btn
            flat
            icon="mdi-google"
            :loading="isLoading"
            @click="socialAction('google')"
          ></q-btn>
        </div>
      </div>

      <div class="row justify-center q-mt-md">
        <q-btn flat @click="toggleVariant">
          {{
            variant === 'REGISTER'
              ? 'Already have an account?'
              : 'New to Messenger?'
          }}
        </q-btn>
        <q-btn flat @click="toggleVariant">
          {{ variant === 'LOGIN' ? 'Register' : 'Login' }}
        </q-btn>
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
const isLoading = ref(false);
const name = ref('');
const password = ref('');
const email = ref('');

const { signIn } = useAuth();
const emit = defineEmits(['success']);

type VARIANT = 'LOGIN' | 'REGISTER';
const variant = ref<VARIANT>('REGISTER');

const onSubmit = async () => {
  if (variant.value === 'REGISTER') {
    try {
      isLoading.value = true;
      const { data, error } = await useFetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: name.value,
          password: password.value,
          email: email.value,
        },
      });
      if (error.value) {
        console.log(error.value);
      }
      if (data.value) {
        console.log('Successfully Registered');
        emit('success', data.value); // You can pass any data you want with the event
      }
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  } else {
    try {
      isLoading.value = true;

      const result = await signIn('credentials', {
        password: password.value,
        email: email.value,
        redirect: false,
      });
      if (result?.ok && !result.error) {
        console.log('Successfully LoggedIn');
        emit('success', result);
      } else {
        console.log('Something Weent Wrong');
      }
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  }
};

const socialAction = async (action: string) => {
  isLoading.value = true;

  await signIn(action, { redirect: false });
};
const toggleVariant = () => {
  if (variant.value === 'REGISTER') {
    variant.value = 'LOGIN';
  } else {
    variant.value = 'REGISTER';
  }
};
</script>

<style scoped></style>
