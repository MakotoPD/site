// Official Cloudflare test keys; only used for development/test on loopback.
export const turnstileTestSiteKey = '1x00000000000000000000AA'
export const turnstileTestSecretKey = '1x0000000000000000000000000000000AA'
export const turnstileTestToken = 'XXXX.DUMMY.TOKEN.XXXX'
export const turnstileActions = ['contact-form', 'quote-form', 'admin-login'] as const
export type TurnstileAction = (typeof turnstileActions)[number]
export function isLoopback(hostname: string) {
  return ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname)
}
export function validTurnstileResult(
  result: { success?: boolean; hostname?: string; action?: string },
  action: TurnstileAction,
  allowedHosts: string[],
  testing = false,
) {
  return (
    result.success === true &&
    (testing ||
      (result.action === action && !!result.hostname && allowedHosts.includes(result.hostname)))
  )
}
