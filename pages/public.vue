<template>
  <div>
    <h1 class="test">$t('typography')</h1>
    <q-card class="q-ma-lg q-pa-md" style="max-width: 800px">
      <div
        v-for="heading in headings"
        :key="heading.label"
        class="row items-center q-mb-lg"
      >
        <div class="col-sm-3 col-12">
          <q-badge color="primary" outline :label="heading.cls" />
          <q-badge
            v-if="heading.equivalent"
            class="q-ml-sm"
            color="primary"
            outline
            :label="heading.equivalent"
          />
        </div>
        <div class="col-sm-9 col-12" :class="heading.cls">
          {{ heading.label }}
        </div>
      </div>
    </q-card>

    <q-card class="q-ma-lg q-pa-md" style="max-width: 800px">
      <div
        v-for="weight in weights"
        :key="weight"
        class="row items-center q-mb-md"
      >
        <div class="col-sm-3 col-12">
          <q-badge color="primary" outline :label="`text-weight-${weight}`" />
        </div>
        <div class="col-sm-9 col-12 q-mb-none q-pl-md q-pt-sm q-pb-sm">
          <div :class="`text-weight-${weight}`">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
const headings = [
  { label: 'Headline 1', cls: 'text-h1', equivalent: 'h1' },
  { label: 'Headline 2', cls: 'text-h2', equivalent: 'h2' },
  { label: 'Headline 3', cls: 'text-h3', equivalent: 'h3' },
  { label: 'Headline 4', cls: 'text-h4', equivalent: 'h4' },
  { label: 'Headline 5', cls: 'text-h5', equivalent: 'h5' },
  { label: 'Headline 6', cls: 'text-h6', equivalent: 'h6' },
  { label: 'Subtitle 1', cls: 'text-subtitle1' },
  { label: 'Subtitle 2', cls: 'text-subtitle2' },
  {
    label:
      'Body 1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.',
    cls: 'text-body1',
  },
  {
    label:
      'Body 2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aliquid ad quas sunt voluptatum officia dolorum cumque, possimus nihil molestias sapiente necessitatibus dolor saepe inventore, soluta id accusantium voluptas beatae.',
    cls: 'text-body2',
  },
  { label: 'Caption text', cls: 'text-caption' },
  { label: 'Overline', cls: 'text-overline' },
];
const weights = ['thin', 'light', 'regular', 'medium', 'bold', 'bolder'];
</script>
<style lang="scss" scoped>
.test {
  color: $olive;
}
</style>
