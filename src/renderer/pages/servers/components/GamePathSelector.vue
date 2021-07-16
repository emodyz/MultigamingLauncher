<template>
  <div v-if="syncedOpened" class="fixed top-0 left-0 right-0 bottom-0 z-50 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-700" />
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform
         transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-gray-800"
      >
        <img :src="game.logo_url" class="absolute ring-4 ring-white bg-white rounded-md -top-7 left-5
          z-20 w-14 h-14 dark:ring-gray-800 dark:bg-gray-800"
        >

        <div
          class="overflow-hidden rounded-lg"
          role="dialog" aria-modal="true" aria-labelledby="modal-headline"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800">
            <div class="mt-4">
              <div>
                <div v-if="installPath !== null">
                  <span class="text-gray-900 font-semibold dark:text-gray-100">
                    This is your current game installation path:
                  </span>
                  <div v-tooltip.top="installPath">
                    <jet-input
                      v-model="installPath"
                      class="mt-1 p-2 w-full cursor-pointer"
                      :error="!isValidPath"
                      disabled
                    />
                    <jet-input-error
                      v-if="!isValidPath"
                      message="This is not a valid game path, please choose another one."
                    />
                  </div>
                </div>
                <div v-else class="mb-2">
                  <span class="bg-red-500 text-red-50 dark:bg-red-800 p-2 rounded-md ">
                    We are not able to find your local <span class="font-bold">{{ game.name }}</span> installation path.
                  </span>
                </div>
              </div>
              <section-border />
              <div>
                <a class="text-gray-700 underline cursor-pointer hover:text-gray-300 dark:text-indigo-400
                 dark:hover:text-indigo-500"
                   @click="chooseGamePath"
                >
                  Select manually
                </a>
                <a class="text-gray-700 underline cursor-pointer hover:text-gray-300 dark:text-indigo-400
                 dark:hover:text-indigo-500 ml-5"
                   @click="autoDetectPath"
                >
                  Retry auto detection
                </a>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse dark:bg-gray-700">
            <jet-button class="ml-2" :disabled="!isValidPath" @click="confirm">
              Confirm
            </jet-button>
            <jet-secondary-button @click="close">
              Cancel
            </jet-secondary-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import { ipcRenderer } from 'electron'
import JetButton from '~/components/JetStream/Button.vue'
import JetSecondaryButton from '~/components/JetStream/SecondaryButton.vue'
import JetInput from '~/components/JetStream/Input.vue'
import JetInputError from '~/components/JetStream/InputError.vue'
import SectionBorder from '~/components/JetStream/SectionBorder.vue'
import GameModule from '~/comunication/GameModule'

@Component({
  components: {
    SectionBorder,
    JetButton,
    JetSecondaryButton,
    JetInput,
    JetInputError
  }
})
export default class GamePathSelector extends Vue {
  @PropSync('opened', { required: true, default: false }) syncedOpened!: boolean;
  @Prop() readonly module!: GameModule
  @Prop() readonly game!: any;
  @Prop() readonly savedGamePath!: string | null;

  installPath: string | null = null;
  isValidPath: boolean = false;

  @Emit('closed')
  close () {
    this.syncedOpened = false
  }

  @Emit('confirmed')
  confirm () {
    this.close()
    return this.installPath
  }

  @Watch('module')
  async onModuleChange () {
    if (!this.savedGamePath) {
      await this.autoDetectPath()
    }
  }

  @Watch('installPath')
  async onInstallPathChange () {
    if (!this.installPath) {
      this.isValidPath = false
      return
    }

    this.isValidPath = await this.module.validateGamePath(this.installPath)
  }

  @Watch('opened')
  async onOpenedModal (opened: boolean) {
    /**
     * On close, reset install path to trigger
     * installPath watcher on re-open.
     */
    if (!opened) {
      this.installPath = null
      return
    }

    if (this.savedGamePath) {
      this.installPath = this.savedGamePath
    } else {
      await this.autoDetectPath()
    }
  }

  async autoDetectPath () {
    this.installPath = await this.module.findGamePath()
  }

  async chooseGamePath () {
    const installPath = await ipcRenderer.invoke('electron.dialog.showOpenDialog', {
      properties: ['openDirectory']
    })

    console.log(installPath)

    if (installPath && installPath.length > 0) {
      this.installPath = installPath.shift() || null
    }
  }
}
</script>

<style scoped>

</style>
