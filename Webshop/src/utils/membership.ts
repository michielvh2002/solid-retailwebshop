import { API_BASE_URL } from '@/constants/appConstants'
import { useSessionStore } from '@/stores/sessionStore'

export const checkPermissions = async (): Promise<object> => {
  const { session } = useSessionStore()
  if (!session.info.isLoggedIn) {
    throw new Error('User needs to be logged in in order to sign upfor delhaizeplus')
  }
  const res = await session.fetch(API_BASE_URL + '/checkPermissions')

  const o = await res.json()
  return o
}

export const registerMember = async () => {
  const { session } = useSessionStore()
  if (!session.info.isLoggedIn) {
    throw new Error('User needs to be logged in in order to sign upfor delhaizeplus')
  }
  const res = await session.fetch(API_BASE_URL + '/signUp', {
    method: 'POST',
  })
  return res
}
