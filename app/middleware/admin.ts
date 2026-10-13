export default defineNuxtRouteMiddleware(async () => {
  const session = await useRequestFetch()('/api/admin/session')
  if (!session.authenticated) return navigateTo('/admin/login')
})
