import { getSolidDataset, getThing, getUrl } from '@inrupt/solid-client'
import { getDefaultSession, login } from '@inrupt/solid-client-authn-browser'
import { SOLID } from '@inrupt/vocab-solid'

const clientName: string = 'ACL App'

export const loginToPod = async (webId: string, redirectUrl: string) => {
  if (!getDefaultSession().info.isLoggedIn) {
    const oidcIssuer = await getOidcIssuer(webId)
    await login({
      oidcIssuer: oidcIssuer,
      redirectUrl: redirectUrl,
      clientName: clientName,
    })
  }
}

const getOidcIssuer = async (webid: string): Promise<string> => {
  const profileDocument = await getSolidDataset(webid, { fetch: fetch })
  const profile = getThing(profileDocument, webid)

  if (profile === null) throw new Error('webid does not exist')

  const oidcIssuer = getUrl(profile, SOLID.oidcIssuer)

  if (oidcIssuer === null) throw new Error('OIDC issuer was not found in webid profile document')

  return oidcIssuer
}

export const getStorageUrl = async (webid: string): Promise<string | null> => {
  const profileDocument = await getSolidDataset(webid, { fetch: fetch })
  const profile = getThing(profileDocument, webid)
  if (profile === null) throw new Error('webid does not exist')
  const url = getUrl(profile, 'http://www.w3.org/ns/pim/space#storage')
  return url!
}
