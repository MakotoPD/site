export default defineNitroPlugin((app) => {
  // Expired leads are also removed at startup; this covers a server that stays up for months.
  const retention = setInterval(() => sql(expiredLeadsSQL).catch(() => {}), 86_400_000)
  retention.unref()
  app.hooks.hook('close', async () => {
    clearInterval(retention)
    closeStorage()
    await closeDatabase()
  })
})
