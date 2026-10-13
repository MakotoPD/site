export default defineEventHandler(async () =>
  (await allPosts()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
)
