<template>
  <div>
    <div v-if="server" class="flex justify-center items-center content-center flex-col">
      <h1>{{ server.name }}</h1>

      <div v-if="server.status" class="max-w-sm rounded overflow-hidden shadow-lg w-1/3 p-3">
        <div class="flex flex-col">
          <span class="font-bold underline">Players:</span>
          <span class="text-sm">Max: <span class="font-bold">{{ server.status.players_online }}</span></span>
          <span class="text-sm">Online: <span class="font-bold">{{ server.status.players_max }}</span></span>
        </div>
        <div class="flex flex-col pt-6">
          <span class="font-bold underline">Status:</span>
          <span v-if="server.status.online" class="text-center flex rounded bg-green-500 uppercase px-2 py-1 text-xs text-white font-bold mr-3">Online</span>
          <span v-if="!server.status.online" class="text-center flex rounded bg-red-500 uppercase px-2 py-1 text-xs text-white font-bold mr-3">Offline</span>
        </div>
      </div>
    </div>


    <div class="relative pt-1">
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
        <div :style="'width: ' + progress + '%'" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"></div>
    </div>
  </div>

    <div class="flex items-center flex-col justify-center shadow-lg absolute bottom-0 left-0 right-0 h-20">
      <button class="bg-blue-500 text-gray-300 rounded px-4 py-2" @click="startDownload">DOWNLOAD</button>
    </div>
  </div>
</template>

<script>
import {DownloaderHelper} from 'node-downloader-helper';

export default {
  transition: 'fade',

  async asyncData ({ params }) {
    const id = params.id
    return { id }
  },

  data () {
    return {
      progress: 0,
      checkServerInterval: null,
      server: null
    }
  },

  mounted () {
    this.loadServer()
    this.checkServerInterval = setInterval(() => {
      this.loadServer()
    }, 30000)
  },

  beforeDestroy () {
    clearInterval(this.checkServerInterval)
  },

  methods: {
    async loadServer () {
      try {
        this.server = (await this.$axios.$get(`/servers/${this.id}`)).data
      } catch (e) {
        console.error(e)
      }
    },

    startDownload () {
      this.progress = 0;
      this.$axios.$get(`/servers/${this.id}/modpacks`)
        .then(res => res.data)
        .then(modpacks => {
          modpacks.forEach(modpack => {
            const manifest = modpack.manifest

            Object.values(manifest).forEach(file => {
              console.log(file)
              const dl = new DownloaderHelper(file.url, '/Users/hubert_i/Downloads/test', {httpsRequestOptions: {rejectUnauthorized: false}});
              dl.on('end', () => console.log('Download Completed'))
              dl.on('progress', stats => {
                this.progress = stats.progress;
              });
              dl.start();
            })
          })
        }).catch(e => console.log(e))
    }

  }

}
</script>

<style scoped>

</style>
