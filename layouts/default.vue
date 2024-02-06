<template>
  <q-layout view="hhh lpR fff">
    <TopNavBar />

    <q-page-container>
      <slot />
    </q-page-container>

    <q-footer class="bg-grey-8 text-white">
      <FooterSection />
    </q-footer>
  </q-layout>
</template>
