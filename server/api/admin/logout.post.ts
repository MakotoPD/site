export default defineEventHandler(async (event) => {
  const token = getCookie(event, cookieName)
  if (token) await sql('DELETE FROM sessions WHERE token=$1', [hashToken(token)])
  deleteCookie(event, cookieName, { path: '/' })
  return { success: true }
})
