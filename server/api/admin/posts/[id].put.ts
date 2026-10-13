export default defineEventHandler((event) => savePost(event, getRouterParam(event, 'id')!))
