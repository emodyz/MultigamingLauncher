<template>
  <form @submit.prevent="sendForgotRequest">
    <div v-if="message" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3"
         role="alert"
    >
      <strong class="font-bold">Holy smokes!</strong>
      <span class="block sm:inline">{{ message }}</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg class="fill-current h-6 w-6 text-green-500" role="button" viewBox="0 0 20 20"
             xmlns="http://www.w3.org/2000/svg"
        ><title>Close</title><path
          d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1
          1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1
          1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
        /></svg>
      </span>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
        Email
      </label>
      <input
        id="email"
        v-model="email" :class="errors.email ? 'border-red-500' : ''"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
        focus:outline-none focus:shadow-outline"
        placeholder="Email" type="email"
      >
      <p v-if="errors.email" class="text-red-500 text-xs italic">{{ errors.email[0] }}</p>
    </div>
    <div class="flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
        focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Send
      </button>
      <NuxtLink class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                to="/auth/login"
      >
        Need to login?
      </NuxtLink>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { $axios } from '~/utils/api'

@Component({
  // @ts-ignore
  auth: 'guest',
  transition: 'fade',
  layout: 'auth'
})
export default class extends Vue {
  loading = false;
  message = null;
  email = '';
  errors = [];

  async sendForgotRequest () {
    this.errors = []
    this.loading = true
    this.message = null

    try {
      const response = await $axios.post('/auth/password/forgot', {
        email: this.email
      }) as any
      this.message = response?.message || null
    } catch (err) {
      this.errors = err?.response?.data?.errors || []
      this.message = err?.response?.message || null
    }
    this.loading = false
  }
}
</script>

<!--<script>
export default {
  name: 'Forgot',
  auth: 'guest',
  layout: 'auth',

  data () {
    return {
      loading: false,
      message: null,
      email: '',
      errors: []
    }
  },

  methods: {
    async sendForgotRequest (event) {
      event.preventDefault()
      this.errors = []
      this.loading = true
      this.message = null

      try {
        const response = await this.$axios.post('/auth/password/forgot', {
          email: this.email
        })
        this.message = response?.message || null
      } catch (err) {
        this.errors = err?.response?.data?.errors || []
        this.message = err?.response?.message || null
      }
      this.loading = false
    }
  }
}
</script>-->

<style scoped>

</style>
