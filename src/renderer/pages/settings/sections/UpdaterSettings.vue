<template>
  <div>
    Updater page
    <div>
      Current version: {{ currentVersion }}
    </div>

    <div v-if="newVersion.value">
      New Version: {{ newVersion.value.version }}
    </div>

    <div v-if="!isUpdateAvailable.value">
      <JetButton @click="checkForUpdate">Check for updates</JetButton>
    </div>

    <div v-if="isUpdateAvailable.value">
      <JetButton @click="processUpdate">Update launcher</JetButton>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UpdaterEvents } from '../../../../shared/comunication/updater/UpdaterProtocol'
import JetButton from '../../../components/JetStream/Button.vue'
import RendererUpdater from '~/comunication/RendererUpdater'

@Component({
  components: {
    JetButton
  }
})
export default class UpdaterSettings extends Vue {
  updater = new RendererUpdater()

  currentVersion = this.updater.version

  newVersion = this.updater.newVersionSync

  isUpdateAvailable = this.updater.isUpdateAvailableSync

  async checkForUpdate () {
    console.log(await this.updater.checkForUpdate())
  }

  async processUpdate () {
    console.log(await this.updater.processUpdate())
  }

  mounted () {
    this.updater.on(UpdaterEvents.UPDATE_DETECTED, value => {
      console.log('ccc', value)
    })
  }

  destroyed () {
    this.updater.destroy()
  }
}
</script>

<style scoped>

</style>
