<template>
  <jet-authentication-card>
    <template #logo>
      <jet-authentication-card-logo />
    </template>

    <form @submit.prevent="submit">
      <div>
        <jet-label for="email" value="Email" />
        <jet-input id="email" v-model="email" type="email"
                   class="mt-1 p-2 block w-full"
                   required autofocus
        />
        <jet-input-error :message="errors.email" />
      </div>

      <div class="mt-4">
        <jet-label for="password" value="Password" />
        <jet-input id="password" v-model="password" type="password"
                   class="mt-1 p-2 block w-full"
                   required autocomplete="current-password"
        />
      </div>

      <div class="flex items-center justify-end mt-4">
        <NuxtLink to="/auth/forgot"
                  class="underline text-sm text-gray-600 hover:text-gray-900 dark:text-gray-100
                  dark:hover:text-gray-200"
        >
          Forgot your password?
        </NuxtLink>

        <jet-button class="ml-4" :class="{ 'opacity-25': processing }" :disabled="processing">
          Login
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

@Component({
  // @ts-ignore
  auth: 'guest',
  layout: 'auth',
  transition: 'fade',
  components: {
    JetAuthenticationCardLogo,
    JetAuthenticationCard,
    JetLabel,
    JetInput,
    JetInputError,
    JetButton
  }

})
export default class Login extends Vue {
  processing = false;

  email = '';
  password = '';
  remember = false;

  errors = {};

  async submit () {
    this.errors = []
    this.processing = true
    try {
      // @ts-ignore
      await this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password,
          device_name: 'Launcher'
        }
      })
    } catch (err) {
      this.errors = err?.response?.data?.errors || {}
    }
    this.processing = false
  }
}
</script>

<style scoped>

</style>
