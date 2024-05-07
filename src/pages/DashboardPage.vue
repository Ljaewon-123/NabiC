<template>
  <div class="row">
    <div class="col">
      <div class="row q-mt-sm">Quick Access</div>
      <div class="row gap-12">
        <div class="col full-height flex">
          <q-card
            v-for="(quick, index) in quickItems"
            :key="index"
            class="quick-access min-w-100"
          >
            <q-card-section class="text-center">
              <q-icon size="lg" color="red" :name="quick.icon"></q-icon>
              <div class="text-subtitle2">{{ quick.title }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              {{ quick.description }}
              asdgahg
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row">Recent Files</div>
      <div class="row"></div>
    </div>
    <div class="col-2">
      <div class="row">1</div>
      <div class="row">2</div>
      <div class="row">3</div>
      <div class="row">4</div>
    </div>
  </div>
  <!-- <div class="flex gap-12">
    <div class="flex gap-12">
      <q-card class="quick-access min-w-100">
        <q-card-section class="text-center">
          <q-icon size="lg" color="red" :name="'image'"></q-icon>
          <div class="text-subtitle2">{{ 'asd' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ 'aewg' }}
          asdgahg
        </q-card-section>
      </q-card>
      <q-card class="quick-access min-w-100">
        <q-card-section class="text-center">
          <q-icon size="lg" color="red" :name="'image'"></q-icon>
          <div class="text-subtitle2">{{ 'asd' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ 'aewg' }}
          asdgahg
        </q-card-section>
      </q-card>
      <q-card class="quick-access min-w-100">
        <q-card-section class="text-center">
          <q-icon size="lg" color="red" :name="'image'"></q-icon>
          <div class="text-subtitle2">{{ 'asd' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ 'aewg' }}
          asdgahg
        </q-card-section>
      </q-card>
      <q-card class="quick-access min-w-100">
        <q-card-section class="text-center">
          <q-icon size="lg" color="red" :name="'image'"></q-icon>
          <div class="text-subtitle2">{{ 'asd' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ 'aewg' }}
          asdgahg
        </q-card-section>
      </q-card>
      <q-card class="quick-access min-w-100">
        <q-card-section class="text-center">
          <q-icon size="lg" color="red" :name="'image'"></q-icon>
          <div class="text-subtitle2">{{ 'asd' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ 'aewg' }}
          asdgahg
        </q-card-section>
      </q-card>
      <q-card class="quick-access min-w-100">
        <q-card-section class="text-center">
          <q-icon size="lg" color="red" :name="'image'"></q-icon>
          <div class="text-subtitle2">{{ 'asd' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ 'aewg' }}
          asdgahg
        </q-card-section>
      </q-card>
    </div>
    <div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const quickItems = ref([
  {
    title: 'Pictures',
    description: '',
    icon: 'image',
  },
  {
    title: 'Documents',
    description: '',
    icon: 'mdi-file-document-outline',
  },
  {
    title: 'Sounds',
    description: '',
    icon: 'o_music_note',
  },
  {
    title: 'Videos',
    description: '',
    icon: 'mdi-video-box',
  },
]);
</script>

<style scoped>
.card {
  display: flex;
  flex: 1 1 auto;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
}

.quick-access {
  display: flex;
  flex: 1 1 auto;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  flex-direction: column;

  transition: all 0.3s ease;

  justify-content: center;
  align-items: center;
  /* background: #fff; */
  /* padding: 20px; */
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; */
  /* border: 2px solid transparent; */
  /* border-radius: 20px; */
  /* box-shadow: 0 2px 6px rgba(136, 148, 171, 0.2),
    0 24px 20px -24px rgba(71, 82, 107, 0.1); */
}
.gap-12 {
  gap: 12px;
}
.min-w-100 {
  min-width: 110px;
}
</style>
