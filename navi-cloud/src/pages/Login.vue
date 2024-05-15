<template>
<v-container fluid class="h-100">
  <div class="background"></div>
  <v-col cols="10" md="4" class="mx-auto">
    <v-card class="pa-4">
      <div class="text-center">
        <h2 class="indigo--text">Vue login Page</h2>
      </div>
      <v-form @submit.prevent="submitHandler" ref="form">
        <v-card-text>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            type="email"
            label="Email"
            placeholder="Email"
            prepend-inner-icon="mdi-account"
            required
          />
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :type="passwordShow?'text':'password'"
            label="Password"
            placeholder="Password"
            prepend-inner-icon="mdi-key"
            :append-icon="passwordShow ? 'mdi-eye':'mdi-eye-off'"
            @click:append="passwordShow = !passwordShow"
            required
          />
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn :loading="loading" variant="tonal" type="submit" color="indigo">
            <span class="white--text px-8">Login</span>
          </v-btn>

          <v-btn :loading="loading" :to="{ name: 'Signup' }" variant="outlined" type="submit" color="indigo">
            <span class="white--text px-8">Signup</span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-col>
</v-container>

<v-snackbar top color="success" v-model="snackbar">
  Login success
</v-snackbar>

</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const snackbar = ref(false)
const passwordShow = ref(false)
const email = ref('')
const emailRules = [
  (v: string) => !!v || 'E-mail is required',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
]
const passwordRules = [
  (v:string) => !!v || 'Password is required',
  (v:string) => (v && v.length >= 6) || 'Password must be 6  characters or more!',
]
const password = ref('')


const submitHandler = async() => {

}

</script>

<style scoped>
.background{
  height: 20%;
}
</style>