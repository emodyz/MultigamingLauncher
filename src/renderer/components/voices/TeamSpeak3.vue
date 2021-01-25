<template>
  <div class="flex flex-col items-center justify-center w-full">
    <img class="w-64" src="https://teamspeak.com/user/themes/teamspeak/images/logo_inverse.svg">
    <div class="px-4 mt-4 w-full">
      <button class="font-semibold rounded-md border border-gray-600 text-gray-200 bg-gray-900 hover:bg-gray-800 p-4
       w-full focus:outline-none" @click="join"
      >
        Join us on TeamSpeak
      </button>
    </div>
    <transition name="fade">
      <div v-if="message" class="mt-5 w-full">
        <div class="bg-gray-700 rounded-md p-4 mt-2">
          <div class="bg-red-800 rounded-md p-2 text-center">
            <span class="text-red-50 font-semibold">
              {{ message }}
            </span>
          </div>
          <div class="text-gray-50 mt-3 font-semibold">
            You can join us with:

            <div class="relative mt-1 flex w-full flex-wrap items-stretch mb-3">
              <input v-model="host" readonly type="text" placeholder="Teamspeak server host"
                     class="p-2 placeholder-gray-400 text-gray-900 relative bg-gray-50 rounded text-base font-semibold
                     outline-none
                     w-full pr-10"
              >
              <span class="z-10 h-full leading-snug font-normal absolute text-center text-green-50 right-1 pt-1">
                <button class="rounded-md text-white px-3 py-1 bg-green-400 outline-none
                focus:outline-none"
                        @click="copy"
                >
                  <span class="text-sm text-green-50">{{ copied }}</span>
                </button>
              </span>
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

@Component
export default class TeamSpeak3 extends Vue {
  @Prop({ required: true }) settings!: any;

  message: string | null = null;

  copied = 'Copy';

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
    this.copied = 'Copied.'

    clipboard.writeText(this.host)

    setTimeout(() => {
      this.copied = 'Copy'
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
