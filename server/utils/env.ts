import type { H3Event } from 'h3'

export function useRuntimeEnv(event: H3Event): Env {
  return event.context.cloudflare.env as unknown as Env
}
