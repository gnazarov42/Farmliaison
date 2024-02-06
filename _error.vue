<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ $t('error-404') }}</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-row justify="center">
              <v-icon icon="md:warning"></v-icon>
            </v-row>
            <v-row justify="center">
              <span class="headline">{{ $t('page-not-found') }}</span>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="goBack">{{ $t('go-back') }}</v-btn>
            <v-btn color="primary" @click="goHome">{{ $t('home') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
definePageMeta({
  layout: 'error',
});

const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push('/');
};
</script>
