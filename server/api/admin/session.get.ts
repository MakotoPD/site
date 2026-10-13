export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)
    return { authenticated: true, email: useRuntimeConfig(event).adminEmail }
  } catch {
    return { authenticated: false, email: '' }
  }
})
