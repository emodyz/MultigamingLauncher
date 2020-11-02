<template>
    <form @submit="login">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email" type="email" placeholder="Email" v-model="email" :class="errors.email ? 'border-red-500' : ''">
        <p v-if="errors.email" class="text-red-500 text-xs italic">{{ errors.email[0] }}</p>
      </div>
      <div class="mb-6 mt-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          Password
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password" type="password" placeholder="*************" v-model="password" required>
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit">
          Sign In
        </button>
        <NuxtLink class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/auth/forgot">
          Forgot Password?
        </NuxtLink>
      </div>
    </form>
</template>

<script>
export default {
  auth: 'guest',
  name: 'Login',
  layout: 'auth',

  data() {
    return {
      loading: false,
      email: 'root@root.com',
      password: 'password',
      errors: []
    }
  },

  methods: {
    async login(event) {
      event.preventDefault();
      this.errors = [];
      this.loading = true;
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
            device_name: "Launcher"
          }
        });
      } catch (err) {
        this.errors = err?.response?.data?.errors || [];
      }
      this.loading = false;
    }
  }
}
</script>

<style scoped>

</style>
