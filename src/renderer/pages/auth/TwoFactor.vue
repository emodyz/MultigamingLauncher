<template>
  <div>
    <div class="mb-4 text-sm text-gray-600 dark:text-gray-100">
      <template v-if="! recovery">
        Please confirm access to your account by entering the authentication code provided by your authenticator
        application.
      </template>

      <template v-else>
        Please confirm access to your account by entering one of your emergency recovery codes.
      </template>
    </div>

    <form @submit.prevent="submit">
      <div v-if="! recovery">
        <jet-label for="code" value="Code" />
        <jet-input id="code" ref="code" v-model="syncedCode" type="text" inputmode="numeric"
                   class="mt-1 p-2 block w-full" autofocus autocomplete="one-time-code"
        />
        <jet-input-error :message="errors.two_factor" />
      </div>

      <div v-else>
        <jet-label for="recovery_code" value="Recovery Code" />
        <jet-input id="recovery_code" ref="recovery_code" v-model="syncedRecoveryCode" type="text"
                   class="mt-1 p-2 block w-full" autocomplete="one-time-code"
        />
        <jet-input-error :message="errors.two_factor" />
      </div>

      <div class="flex items-center justify-end mt-4">
        <button type="button" class="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer
         dark:text-gray-100 dark:hover:text-gray-200" @click.prevent="toggleRecovery"
        >
          <template v-if="! recovery">
            Use a recovery code
          </template>

          <template v-else>
            Use an authentication code
          </template>
        </button>

        <button type="button" class="ml-4 text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer
         dark:text-gray-100 dark:hover:text-gray-200" @click.prevent="cancelLogin"
        >
          Cancel
        </button>

        <jet-button class="ml-4" :class="{ 'opacity-25': processing }" :disabled="processing">
          Login
        </jet-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">

import { Component, Emit, Prop, PropSync, Vue } from 'vue-property-decorator'
import JetAuthenticationCard from '~/components/JetStream/AuthenticationCard.vue'
import JetAuthenticationCardLogo from '~/components/JetStream/AuthenticationCardLogo.vue'
import JetButton from '~/components/JetStream/Button.vue'
import JetInput from '~/components/JetStream/Input.vue'
import JetLabel from '~/components/JetStream/Label.vue'
import JetInputError from '~/components/JetStream/InputError.vue'

@Component({
  // @ts-ignore
  auth: 'guest',
  layout: 'auth',
  transition: 'fade',
  components: {
    JetInputError,
    JetButton,
    JetAuthenticationCard,
    JetAuthenticationCardLogo,
    JetButton,
    JetInput,
    JetLabel
  }
})
export default class TwoFactor extends Vue {
  @PropSync('code', { type: String }) syncedCode!: string;
  @PropSync('recovery_code', { type: String }) syncedRecoveryCode!: string;
  @Prop({ type: Boolean, default: false }) processing!: boolean;
  @Prop({ default: {} }) errors!: any;

  recovery: boolean = false;

  @Emit()
  submit () {

  }

  @Emit()
  cancelLogin () {

  }

  toggleRecovery () {
    // @ts-ignore
    this.recovery ^= true
    this.$nextTick(() => {
      if (this.recovery) {
        // @ts-ignore
        this.$refs.recovery_code.focus()
        this.syncedCode = ''
      } else {
        // @ts-ignore
        this.$refs.code.focus()
        this.syncedRecoveryCode = ''
      }
    })
  }
}

/**
 export default {
  components: {
    JetAuthenticationCard,
    JetAuthenticationCardLogo,
    JetButton,
    JetInput,
    JetLabel
  },
  data () {
    return {
      recovery: false,
      form: {

      }
    }
  },
  methods: {
    toggleRecovery () {
      this.recovery ^= true
      this.$nextTick(() => {
        if (this.recovery) {
          this.$refs.recovery_code.focus()
          this.form.code = ''
        } else {
          this.$refs.code.focus()
          this.form.recovery_code = ''
        }
      })
    },
    submit () {
      this.form.post(this.route('two-factor.login'))
    }
  }
} */
</script>
