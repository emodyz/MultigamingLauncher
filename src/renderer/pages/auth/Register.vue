<template>
  <jet-authentication-card>
    <template #logo>
      <jet-authentication-card-logo />
    </template>

    <div v-if="message" class="mb-4 font-medium text-sm text-green-600 dark:text-green-500">
      <span v-if="message.type === 'success'" class="text-green-600 dark:text-green-500">{{ message.value }}</span>
      <span v-if="message.type === 'error'" class="text-red-600 dark:text-red-500">{{ message.value }}</span>
    </div>

    <form @submit.prevent="submit">
      <div>
        <jet-label for="name" value="Name" />
        <jet-input id="name" v-model="form.name" type="text" class="mt-1 p-2 block w-full" required autofocus
                   autocomplete="name"
        />
        <jet-input-error :message="errors.name" />
      </div>

      <div class="mt-4">
        <jet-label for="email" value="Email" />
        <jet-input id="email" v-model="form.email" type="email" class="mt-1 p-2 block w-full" required />
        <jet-input-error :message="errors.email" />
      </div>

      <div class="mt-4">
        <jet-label for="password" value="Password" />
        <jet-input id="password" v-model="form.password" type="password" class="mt-1 p-2 block w-full" required
                   autocomplete="new-password"
        />
        <jet-input-error :message="errors.password" />
      </div>

      <div class="mt-4">
        <jet-label for="password_confirmation" value="Confirm Password" />
        <jet-input id="password_confirmation" v-model="form.password_confirmation" type="password"
                   class="mt-1 p-2 block w-full" required autocomplete="new-password"
        />
        <jet-input-error :message="errors.password_confirmation" />
      </div>

      <div class="flex items-center justify-end mt-4">
        <NuxtLink to="/auth/login" class="underline text-sm text-gray-600 hover:text-gray-900 dark:text-gray-100
                  dark:hover:text-gray-200"
        >
          Already registered?
        </NuxtLink>

        <jet-button class="ml-4" :class="{ 'opacity-25': processing }" :disabled="processing">
          Register
        </jet-button>
      </div>
    </form>
  </jet-authentication-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JetAuthenticationCard from '~/components/JetStream/AuthenticationCard.vue'
import JetAuthenticationCardLogo from '~/components/JetStream/AuthenticationCardLogo.vue'
import JetLabel from '~/components/JetStream/Label.vue'
import JetInput from '~/components/JetStream/Input.vue'
import JetInputError from '~/components/JetStream/InputError.vue'
import JetButton from '~/components/JetStream/Button.vue'
import { $axios } from '~/utils/api'

@Component({
  // @ts-ignore
  auth: 'guest',
  transition: 'fade',
  layout: 'auth',
  components: {
    JetAuthenticationCardLogo,
    JetAuthenticationCard,
    JetLabel,
    JetInput,
    JetInputError,
    JetButton
  }
})
export default class Forgot extends Vue {
  processing = false;

  message: {
    type: string,
    value: string
  } | null = null;

  form = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  }

  errors = {};

  async submit () {
    this.errors = {}
    this.processing = true
    try {
      await $axios.post('/auth/register', {
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
        password_confirmation: this.form.password_confirmation
      })

      this.message = {
        type: 'success',
        value: `Welcome ${this.form.name} ! You will be redirected to the login page.`
      }

      setTimeout(() => {
        this.$router.push('/auth/login')
      }, 3000)
    } catch (err) {
      this.errors = err?.response?.data?.errors || {}
    }
    this.processing = false
  }
}
</script>

<style scoped>

</style>
