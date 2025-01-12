import { loginToPod } from '@/utils/login'
import { getDefaultSession, Session } from '@inrupt/solid-client-authn-browser'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSessionStore = defineStore(
  'sessionStore',
  () => {
    const session = ref<Session>(getDefaultSession())

    const login = async (webId: string, redirectUrl: string) => {
      await loginToPod(webId, redirectUrl, session.value)
    }

    return { session, login }
  },
  {
    persist: true,
  },
)
