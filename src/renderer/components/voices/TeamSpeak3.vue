<template>
  <div class="flex flex-col items-center justify-center w-full p-2">
    <img class="w-64" src="https://teamspeak.com/user/themes/teamspeak/images/logo_inverse.svg">
    <div class="px-4 mt-4 w-full">
      <jet-button class="w-full justify-center h-10" @click="join">
        Join us on TeamSpeak
      </jet-button>
    </div>
    <transition name="fade">
      <div v-if="message" class="mt-5 w-full p-2">
        <div
          class="rounded-md p-4 mt-2 bg-gray-100 shadow-md border border-gray-200
        dark:bg-gray-800 dark:border-transparent"
        >
          <div class="bg-red-500 rounded-md p-2 text-center dark:bg-red-800">
            <span class="text-red-50 font-semibold">
              {{ message }}
            </span>
          </div>
          <div class="text-gray-900  mt-3 font-semibold dark:text-gray-50">
            You can join us with:

            <div class="relative mt-1 flex w-full flex-wrap items-stretch mb-3">
              <jet-input v-model="host" class="w-full p-2" readonly type="text" placeholder="Teamspeak server host" />
              <div
                v-tooltip="{
                  content: 'Copied.',
                  show: copied,
                  placement: 'bottom',
                  trigger: 'manual'
                }"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-300
              cursor-pointer hover:text-green-400" @click="copy"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" class="stroke-current w-6 h-6"
                >
                  <path
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0
                         012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { shell, clipboard } from 'electron'
import JetButton from '~/components/JetStream/Button.vue'
import JetInput from '~/components/JetStream/Input.vue'

@Component({
  components: {
    JetButton,
    JetInput
  }
})
export default class TeamSpeak3 extends Vue {
  @Prop({ required: true }) settings!: any

  message: string | null = null

  copied = false

  get host () {
    return `${this.settings.payload.ip}:${this.settings.payload.port}`
  }

  async join () {
    try {
      await shell.openExternal(`ts3server://${this.host}/`)
    } catch (e) {
      this.message = 'Cannot join this server.'
      console.log('Cannot open teamspeak', e)
    }
  }

  copy () {
    this.copied = true

    clipboard.writeText(this.host)

    setTimeout(() => {
      this.copied = false
    }, 1000)
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to, .fade-leave-active {
  opacity: 0;
}
</style>
