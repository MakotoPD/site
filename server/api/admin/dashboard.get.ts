export default defineEventHandler(async () => {
  const [leads, posts] = await Promise.all([allLeads(), allPosts()])
  return {
    total: leads.length,
    fresh: leads.filter((l) => l.status === 'new').length,
    quotes: leads.filter((l) => l.source === 'calculator').length,
    pipeline: leads
      .filter((l) => !['closed', 'won'].includes(l.status))
      .reduce((sum, l) => sum + (l.quote?.total || 0), 0),
    published: posts.filter((p) => p.status === 'published').length,
    recent: leads.slice(0, 6),
  }
})
