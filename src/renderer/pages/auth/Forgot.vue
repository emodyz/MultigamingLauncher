<template>
  <jet-authentication-card>
    <template #logo>
      <jet-authentication-card-logo />
    </template>

    <div class="mb-4 text-sm text-gray-600 dark:text-gray-100">
      Forgot your password? No problem. Just let us know your email address and we will email you a password reset
      link that will allow you to choose a new one.
    </div>

    <div v-if="message" class="mb-4 font-medium text-sm text-green-600 dark:text-green-500">
      <span v-if="message.type === 'success'" class="text-green-600 dark:text-green-500">{{ message.value }}</span>
      <span v-if="message.type === 'error'" class="text-red-600 dark:text-red-500">{{ message.value }}</span>
    </div>

    <form class="mt-7" @submit.prevent="submit">
      <div>
        <jet-label for="email" value="Email" />
        <jet-input id="email" v-model="email" type="email" class="mt-1 block w-full p-2" required autofocus />
        <jet-input-error :message="errors.email" />
      </div>

      <div class="flex items-center justify-end mt-4">
        <NuxtLink
          to="/auth/login"
          class="underline text-sm text-gray-600 hover:text-gray-900 dark:text-gray-100
                  dark:hover:text-gray-200"
        >
          Want to login?
        </NuxtLink>

        <jet-button class="ml-4" :class="{ 'opacity-25': processing }" :disabled="processing">
          Email Password Reset Link
        </jet-button>
      </div>
    </form>
  </jet-authentication-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { $axios } from '@/utils/api'
import JetAuthenticationCard from '@/components/JetStream/AuthenticationCard.vue'
import JetAuthenticationCardLogo from '@/components/JetStream/AuthenticationCardLogo.vue'
import JetLabel from '@/components/JetStream/Label.vue'
import JetInput from '@/components/JetStream/Input.vue'
import JetInputError from '@/components/JetStream/InputError.vue'
import JetButton from '@/components/JetStream/Button.vue'

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
  processing = false
  message: {
    type: string,
    value: string
  } | null = null

  email = ''
  errors = {}

  async submit () {
    this.errors = []
    this.processing = true
    this.message = null

    try {
      const response = await $axios.post('/auth/password/forgot', {
        email: this.email
      }) as any
      if (response?.data?.message) {
        this.message = {
          type: 'success',
          value: response?.data?.message
        }
      }
    } catch (err: any) {
      this.errors = err?.response?.data?.errors || {}

      if (Object.values(this.errors).length === 0 && err?.response?.data?.message) {
        this.message = {
          type: 'error',
          value: err?.response?.data?.message
        }
      }
    }
    this.processing = false
  }
}
</script>

<style scoped>

</style>
