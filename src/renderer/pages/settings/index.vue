<template>
  <div class="flex flex-col h-full text-gray-900 dark:text-gray-100">
    <div class="flex justify-between w-full p-3">
      <div class="flex items-center">
        <img :src="$auth.user.profile_photo_url" class="rounded-full w-20 h-20 shadow-sm">
        <div class="flex flex-col">
          <span class="ml-2 text-xl">
            {{ $auth.user.name }}
          </span>
          <span class="ml-2 text-gray-400">
            Your personal account
          </span>
        </div>
      </div>
      <div class=" items-center">
        <jet-secondary-button @click="goToProfileSettings">
          Open profile settings
        </jet-secondary-button>
      </div>
    </div>
    <div class="flex pt-2">
      <div class="h-full w-80 px-4">
        <div
          class="rounded-md border border-gray-200 bg-gray-50 divide-y dark:bg-gray-800 dark:border-gray-700
        dark:divide-gray-700"
        >
          <div class="py-2 px-4 font-bold bg-gray-100 dark:bg-gray-900">
            Account settings
          </div>

          <div
            v-for="section of sections" :key="section.name"
            class="relative py-2 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900"
            @click="selectSection(section.name)"
          >
            <div
              v-if="currentSection.name === section.name" class="border-l-2 border-r border-indigo-400
             h-full absolute top-0 bottom-0 left-0 dark:border-orange-700"
            />
            {{ section.name }}
          </div>
        </div>
      </div>

      <div class="px-1 w-full">
        <component :is="currentSection.component" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer } from 'electron'
import AppearanceSettings from './sections/AppearanceSettings.vue'
import UpdaterSettings from './sections/UpdaterSettings.vue'
import { pageStore } from '@/store'
import JetButton from '@/components/JetStream/Button.vue'
import JetSecondaryButton from '@/components/JetStream/SecondaryButton.vue'

interface Section {
  name: string;
  component: any
}

export enum SettingsSections {
  APPEARANCE = 'Appearance',
  APP_UPDATER = 'App Updater'
}

@Component({
  components: {
    JetButton,
    JetSecondaryButton
  }
})
export default class Settings extends Vue {
  sections: Section[] = [
    {
      name: SettingsSections.APPEARANCE,
      component: AppearanceSettings
    },
    {
      name: SettingsSections.APP_UPDATER,
      component: UpdaterSettings
    }
  ]

  currentSection: Section = this.sections[0]

  mounted () {
    this.selectSection(this.$route.query.section as string)
    pageStore.noTitle()
  }

  selectSection (sectionName: string|null) {
    const section = this.sections.find(section => section.name === sectionName)
    if (section) {
      this.currentSection = section
    } else {
      this.currentSection = this.sections[0]
    }
  }

  goToProfileSettings () {
    // @ts-ignore
    const url = this.$axios.defaults.baseURL.replace('/api', '/user/profile')
    ipcRenderer.invoke('electron.shell.openExternal', url)
  }
}
</script>

<style scoped>

</style>
