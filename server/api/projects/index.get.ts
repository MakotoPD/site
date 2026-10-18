export default defineEventHandler(async () =>
  (await allProjects()).map(({ document, ...project }) => project),
)
