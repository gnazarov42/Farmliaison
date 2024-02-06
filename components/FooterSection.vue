<template>
  <q-toolbar>
    <q-toolbar-title class="row">
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar>
      <div>Title</div>
      <LocaleSwitcher class="q-ml-auto" />
    </q-toolbar-title>
    <!-- <q-container>
        <div class="row">
          <div class="column" cols="12" md="3">
            <h4>About Us</h4>
            <q-list>
              <q-item v-for="link in aboutLinks" :key="link">
                <q-item-section>{{ $t(`${link}`) }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="column" cols="12" md="3">
            <h4>Experiences</h4>
            <q-list>
              <q-item v-for="link in experienceLinks" :key="link">
                <q-item-section>{{ $t(`${link}`) }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="column" cols="12" md="3">
            <h4>Support</h4>
            <q-list>
              <q-item v-for="link in supportLinks" :key="link">
                <q-item-section>{{ $t(`${link}`) }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="column" cols="12" md="3">
            <h4>Connect</h4>
            <q-btn icon flat round>
              <q-icon name="emoticon_happy_outline"></q-icon>
            </q-btn>
            <q-btn icon flat round>
              <q-icon name="mdi-twitter"></q-icon>
            </q-btn>
            <q-btn icon flat round>
              <q-icon name="mdi-instagram"></q-icon>
            </q-btn>
          </div>
        </div>
        <q-separator></q-separator>
        <div class="row">
          <div class="column" cols="12">
            <p>&copy; {{ new Date().getFullYear() }} FarmLiaison</p>
          </div>
        </div>
      </q-container> -->
  </q-toolbar>
</template>

<script setup>
// const aboutLinks = ref(['our-mission', 'team', 'blog']);
// const experienceLinks = ref(['farm-visits', 'room-rentals', 'masterclasses']);
// const supportLinks = ref(['faqs', 'contact-us', 'terms-and-conditions']);
</script>
