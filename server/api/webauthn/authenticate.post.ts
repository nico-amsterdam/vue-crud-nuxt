export default defineWebAuthnAuthenticateEventHandler({
  async storeChallenge(event, challenge, attemptId) {
    const env = event.context.cloudflare.env as unknown as Env

    await env.KV.put(`auth:challenge:${attemptId}`, challenge, { expirationTtl: 60 })
  },
  async getChallenge(event, attemptId) {

    const env = event.context.cloudflare.env as unknown as Env

    const challenge = await env.KV.get<string>(`auth:challenge:${attemptId}`)
    if (!challenge) {
      throw createError({
        statusCode: 400,
        message: 'Challenge not found or expired'
      })
    }
    await env.KV.delete(`auth:challenge:${attemptId}`)
    return challenge
  },
  async allowCredentials(event, userName) {
    const env = event.context.cloudflare.env as unknown as Env

    const user = await useDB(env).query.users.findFirst({
      where: eq(tables.users.username, userName),
      with: {
        credentials: true
      }
    })

    return user?.credentials || []
  },
  async getCredential(event, credentialID) {
    const env = event.context.cloudflare.env as unknown as Env

    const credential = await useDB(env).query.credentials.findFirst({
      where: eq(tables.credentials.id, credentialID),
      with: {
        user: true
      }
    })

    if (!credential) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Credential not found'
      })
    }

    return credential
  },
  async onSuccess(event, { credential }) {
    await setUserSession(event, {
      user: {
        id: credential.user.id,
        name: credential.user.name,
        username: credential.user.username
      }
    })
  }
})
