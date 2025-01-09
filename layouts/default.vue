<template>
  <q-layout view="Hhh lpr fff">
    <TopNavBar />
    <LeftTabs />
    <q-page-container>
      <slot />
    </q-page-container>

    <q-footer class="bg-dark-white-sand text-black q-px-xl q-pb-md">
      <FooterSection />
    </q-footer>
  </q-layout>
</template>
<style lang="scss" scoped>
.q-page-container {
  margin: auto;
  padding-left: 90px;
  padding-right: 80px;

  @media screen and (max-width: 1125px) {
    padding-left: 90px;
    padding-right: 40px;
  }
  @media screen and (max-width: 599px) {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
