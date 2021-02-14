import { Plugin } from '@nuxt/types'
import axios from 'axios'
import aspida from '@aspida/axios'
import api from '~/server/api/$api'

const tmp = api(aspida(axios))

type ApiInstance = typeof tmp

declare module 'vue/types/vue' {
  interface Vue {
    $api: ApiInstance
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $api: ApiInstance
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  interface Store<S> {
    $api: ApiInstance
  }
}

const plugin: Plugin = ({ $axios }, inject) =>
  inject('api', api(aspida($axios)))

export default plugin
