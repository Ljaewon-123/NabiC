<template>
<v-main class="d-flex justify-center align-center">
  <v-col cols="10" md="4" class="mx-auto">
    <v-card class="pa-4">
      <div class="text-center">
        <h2 class="indigo--text">Sign up</h2>
      </div>
      <v-form @submit.prevent="submitHandler" validate-on="submit lazy" ref="form">
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
            <span class="white--text px-8">Signup</span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-col>
</v-main>

<v-snackbar location="top" :color="snack.snackColor.value" v-model="snack.snackbar.value">
  {{ snack.snackMess.value }}
</v-snackbar>

</template>

<script setup lang="ts">
import { naviapi } from '@/boots/AxiosInstance';
import { VSnack } from '@/utils/VSnack';
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const snack = new VSnack()

const router = useRouter()

const loading = ref(false)
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

  loading.value = true
  
  try{
    await naviapi.post('auth/signup', {
      email: email.value,
      password: password.value,
    })
  }
  catch{
    snack.showSnack('Fail Signup', 'error')
    return
  }
  finally{
    loading.value = false
  }

  snack.showSnack('Success Signup', 'success')

  setTimeout(() => router.push({ name: 'Login' }), 1000)
}

</script>

