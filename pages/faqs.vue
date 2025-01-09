<template>
  <div>
    <h1 class="q-mb-sm">{{ $t('got_questions') }}</h1>
    <p>
      <strong>{{ $t('get_in_touch') }}</strong>
    </p>
  </div>

  <div class="content-container row q-my-xl">
    <!-- Left side with dropdowns -->
    <div class="faq q-pr-lg">
      <q-card-section>
        <h2 class="q-mt-none">{{ $t('frequently_asked_questions') }}</h2>
      </q-card-section>
      <!-- Card 1: AI Profile Creation -->
      <q-card flat>
        <q-btn
          class="q-pa-md"
          @click="expanded[0] = !expanded[0]"
          style="width: 100%"
        >
          <div class="text-h5 q-mt-sm q-mb-xs">
            {{ $t('ai_profile_creation') }}
          </div>
          <q-space />
          <q-icon
            color="primary"
            dense
            :name="expanded[0] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          >
          </q-icon>
        </q-btn>
        <q-slide-transition>
          <div v-show="expanded[0]">
            <q-separator />
            <q-card-section>
              {{ $t('ai_profile_creation_answer') }}
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>

      <!-- Card 2: Edit AI Descriptions -->
      <q-card flat>
        <q-btn
          class="q-pa-md"
          @click="expanded[1] = !expanded[1]"
          style="width: 100%"
        >
          <div class="text-h5 q-mt-sm q-mb-xs">
            {{ $t('edit_ai_descriptions') }}
          </div>
          <q-space />
          <q-icon
            color="primary"
            dense
            :name="expanded[1] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          >
          </q-icon>
        </q-btn>
        <q-slide-transition>
          <div v-show="expanded[1]">
            <q-separator />
            <q-card-section>
              {{ $t('edit_ai_descriptions_answer') }}
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>

      <!-- Card 3: AI Supported Languages -->
      <q-card flat>
        <q-btn
          class="q-pa-md"
          @click="expanded[2] = !expanded[2]"
          style="width: 100%"
        >
          <div class="text-h5 q-mt-sm q-mb-xs">
            {{ $t('ai_supported_languages') }}
          </div>
          <q-space />
          <q-icon
            color="primary"
            dense
            :name="expanded[2] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          >
          </q-icon>
        </q-btn>
        <q-slide-transition>
          <div v-show="expanded[2]">
            <q-separator />
            <q-card-section>
              {{ $t('ai_supported_languages_answer') }}
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>

      <!-- Card 4: AI Translation Accuracy -->
      <q-card flat>
        <q-btn
          class="q-pa-md"
          @click="expanded[3] = !expanded[3]"
          style="width: 100%"
        >
          <div class="text-h5 q-mt-sm q-mb-xs">
            {{ $t('ai_translation_accuracy') }}
          </div>
          <q-space />
          <q-icon
            color="primary"
            dense
            :name="expanded[3] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          >
          </q-icon>
        </q-btn>
        <q-slide-transition>
          <div v-show="expanded[3]">
            <q-separator />
            <q-card-section>
              {{ $t('ai_translation_accuracy_answer') }}
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>
    </div>

    <!-- Contact Us -->
    <div class="contact">
      <q-card flat>
        <q-card-section>
          <h2 class="q-mt-none">{{ $t('contact_us') }}</h2>
        </q-card-section>
        <div class="column q-gutter-sm q-px-md">
          <q-input
            v-model="contactForm.name"
            :label="$t('name')"
            required
            outlined
            :disable="isLoading"
          />
          <q-input
            v-model="contactForm.email"
            :label="$t('email')"
            required
            outlined
            :disable="isLoading"
          />
          <q-input
            v-model="contactForm.message"
            :label="$t('message')"
            required
            outlined
            :disable="isLoading"
            type="textarea"
          />
        </div>
        <q-card-actions vertical class="q-px-none q-mb-md">
          <q-btn
            rounded
            no-caps
            color="primary"
            :loading="isLoading"
            class="q-mx-md q-mb-sm"
          >
            {{ $t('send_the_message') }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isLoading = ref(false);
const expanded = ref([false, false, false, false]);

definePageMeta({
  layout: 'limited',
  meta: {
    title: 'For Farmers',
    metaTags: [
      {
        name: 'description',
        content:
          'Join FarmLiaison to expand your market reach, increase profitability, and connect with a global community. Empower your farming business with our user-friendly platform designed for farmers worldwide.',
      },
      {
        property: 'og:description',
        content:
          'Join FarmLiaison to expand your market reach, increase profitability, and connect with a global community. Empower your farming business with our user-friendly platform designed for farmers worldwide.',
      },
    ],
  },
});
// TODO: handle the form
const contactForm = ref({
  message: '',
  name: '',
  phone: '',
  email: '',
});
</script>

<style lang="scss" scoped>
:deep(.q-field--outlined .q-field__control) {
  border-radius: 16px;
}

.faq {
  width: 70%;
}
.contact {
  width: 30%;
}

@media screen and (max-width: 600px) {
  .content-container {
    flex-direction: column;
    align-items: center; /* Centers children vertically if they wrap */
  }

  .contact {
    width: 100%;
  }

  .faq {
    width: 100%;
    padding-right: 0px;
  }
}
</style>
