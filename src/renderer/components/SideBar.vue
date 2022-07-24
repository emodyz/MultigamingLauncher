<template>
  <nav
    class="fixed z-50 flex flex-col justify-between w-20 h-full bg-gray-100 border-r border-gray-300
     dark:bg-gray-800 dark:border-gray-600"
  >
    <div class="mt-10 mb-10">
      <div v-tooltip.right="'Settings'">
        <a href="#" @click="goToPanel">
          <img
            :src="$auth.user.profile_photo_url"
            class="w-10 h-10 mx-auto mb-3 rounded-full shadow-md"
          >
        </a>
      </div>
      <div class="mt-10">
        <ul>
          <li class="mb-6">
            <NuxtLink to="/home">
              <svg
                class="w-8 h-8 mx-auto text-gray-400 stroke-current hover:text-indigo-400 dark:text-gray-300"
                fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0
                    001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                />
              </svg>
            </NuxtLink>
          </li>
          <li class="mb-6">
            <NuxtLink to="/servers">
              <svg
                class="w-8 h-8 mx-auto text-gray-400 stroke-current hover:text-indigo-400 dark:text-gray-300"
                fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2
                 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0
                  00-2-2m-2-4h.01M17 16h.01" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                />
              </svg>
            </NuxtLink>
          </li>
          <transition-group name="pop">
            <li v-for="server of favorites" :key="server.id" class="mb-3">
              <div
                v-tooltip.right="server.name"
                :class="{'server-selected': $route.fullPath === '/servers/' + server.id}"
                class="relative"
                @click="goToServer(server)"
              >
                <div class="relative w-3/5 mx-auto">
                  <img :src="server.logo_url" class="object-cover shadow-md server-picture">
                  <div
                    v-if="hasUpdate(server.id, server.update_hash)"
                    class="absolute top-0 right-0 flex transition-all transition cursor-pointer"
                    :class="{
                      'translate-x-0.5': $route.fullPath === '/servers/' + server.id,
                      '-translate-y-0.5': $route.fullPath === '/servers/' + server.id
                    }"
                  >
                    <span class="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping" />
                    <span class="relative inline-flex w-3 h-3 bg-red-500 rounded-full" />
                  </div>
                </div>
              </div>
            </li>
          </transition-group>
        </ul>
      </div>
    </div>
    <div class="mb-4">
      <div v-if="isUpdateAvailable">
        <a class="flex justify-center mb-6 cursor-pointer" @click="goToUpdatePage">
          <svg
            class="h-5 w-5 text-green-500 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
        </a>
      </div>
      <div v-if="downloaders.length > 0" class="relative">
        <span v-if="downloaders.length > 1" class="absolute w-5 h-5 -top-2 right-4">
          <span
            class="relative flex inline-flex items-center justify-center
             w-5 h-5 text-white text-sm bg-indigo-400 rounded-full"
          >
            {{ downloaders.length }}
          </span>
        </span>
        <a class="flex justify-center mb-6 cursor-pointer" @click="showAll">
          <div class="w-8 h-10 loader">
            <svg
              class="
            w-5 h-5 m-2 mx-auto text-gray-400 stroke-current hover:text-indigo-500
             dark:text-gray-300 dark:hover:text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="2"
              />
            </svg>
          </div>
        </a>
      </div>
      <a class="cursor-pointer" @click="logout">
        <span>
          <svg
            class="
            w-5 h-5 mx-auto text-gray-400 fill-current
            hover:text-red-600
            dark:text-gray-300 dark:hover:t ext-red-500
            "
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 4.00894C13.0002 3.45665 12.5527 3.00876 12.0004 3.00854C11.4481 3.00833 11.0002 3.45587 11
                4.00815L10.9968 12.0116C10.9966 12.5639 11.4442 13.0118 11.9965 13.012C12.5487 13.0122 12.9966
                12.5647 12.9968 12.0124L13 4.00894Z"
              fill="currentColor"
            />
            <path
              d="M4 12.9917C4 10.7826 4.89541 8.7826 6.34308 7.33488L7.7573 8.7491C6.67155 9.83488 6 11.3349 6
                12.9917C6 16.3054 8.68629 18.9917 12 18.9917C15.3137 18.9917 18 16.3054 18 12.9917C18 11.3348
                17.3284 9.83482 16.2426 8.74903L17.6568 7.33481C19.1046 8.78253 20 10.7825 20 12.9917C20 17.41 16.4183
                20.9917 12 20.9917C7.58172 20.9917 4 17.41 4 12.9917Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </a>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { downloadersStore, updaterStore, appUpdaterStore, serverStore } from '~/store'
import { SettingsSections } from '~/pages/settings/index.vue'

@Component
export default class SideBar extends Vue {
  get hasUpdate () {
    return updaterStore.hasUpdate
  }

  get favorites () {
    return serverStore.favorites
  }

  get downloaders () {
    return downloadersStore.downloaders
  }

  get isUpdateAvailable () {
    return appUpdaterStore.isUpdateAvailable
  }

  async created () {
    await this.$store.dispatch('servers/sync')
  }

  showAll () {
    downloadersStore.showAll()
  }

  async logout () {
    // @ts-ignore
    await this.$auth.logout()
  }

  goToServer (server) {
    this.$router.push('/servers/' + server.id)
  }

  goToPanel () {
    this.$router.push('/settings')
  }

  goToUpdatePage () {
    this.$router.push(`/settings?section=${SettingsSections.APP_UPDATER}`)
  }
}
</script>

<style scoped>

.server-picture {
  cursor: pointer;
  transition: border-radius 0.5s;
  border-radius: 100%;
}

.server-picture:hover {
  animation-name: shakeit;
  animation-duration: 0.5s;
  animation-timing-function: linear;
  border-radius: 30%;
}

.server-selected img {
  border-radius: 30%;
  animation: none;
}

.server-selected::before {
  @apply bg-indigo-400 dark:bg-white;

  content: '';
  position: absolute;
  left: -15px;
  top: 0;
  bottom: 0;
  width: 15px;
  border-radius: 20px;
  animation: community-selected-animation 0.3s forwards;
}

@keyframes shakeit {
  0% {
    border-radius: 50%;
  }
  30% {
    border-radius: 20%;
  }
  60% {
    border-radius: 30%;
  }
  90% {
    border-radius: 33%;
  }
  100% {
    border-radius: 30%;
  }
}

@keyframes community-selected-animation {
  100% {
    left: -10px;
  }
}

.nuxt-link-active .stroke-current {
  @apply text-indigo-400 hover:text-indigo-500
}

.nav-shadow {
  animation: slideShadown 1s forwards;
  box-shadow: 10px 0px 20px 0px theme("colors.indigo.400");
  width: 0;
  left: 0;
  top: 0;
  bottom: 0;
}

@keyframes slideShadown {
  100% {
    width: 5em;
  }
}

@keyframes rotate {
  100% {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}

.loader {
  position: relative;
  overflow: hidden;
  border-radius: 40%;
}

.loader::before {
  @apply bg-gradient-to-br from-gray-900 via-indigo-400 to-indigo-400;

  content: "";
  position: absolute;
  z-index: -2;
  left: -50%;
  top: -50%;
  width: 200%;
  height: 200%;
  background-repeat: no-repeat;
  background-size: 50% 50%, 50% 50%;
  animation: rotate 1s linear infinite;
}

.loader::after {
  @apply bg-gray-100 dark:bg-gray-800;

  content: "";
  position: absolute;
  z-index: -1;
  left: 2px;
  top: 2px;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  border-radius: 40%;
}

</style>
