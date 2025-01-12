import { API_BASE_URL } from '@/constants/appConstants'
import { useSessionStore } from '@/stores/sessionStore'

export const getOrdersFrom = async (webid: string) => {
  const { session } = useSessionStore()
  const res = await session.fetch(API_BASE_URL + `/orderhistory?webid=${encodeURIComponent(webid)}`)
  return await res.json()
}

export const getDemographicdataFrom = async (webid: string) => {
  const { session } = useSessionStore()
  const res = await session.fetch(
    API_BASE_URL + `/demographicdata?webid=${encodeURIComponent(webid)}`,
  )
  return await res.json()
}

export const getSuperplusMembers = async () => {
  const { session } = useSessionStore()
  const res = await session.fetch(API_BASE_URL + '/superplusmembers', {
    method: 'GET',
  })

  return await res.json()
}
