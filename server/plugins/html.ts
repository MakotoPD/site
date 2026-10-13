export default defineNitroPlugin((app) => {
  // Cloudflare's e-mail obfuscation rewrites addresses in the served HTML, which no longer
  // matches what Vue hydrates. These markers are its documented opt-out for a section.
  app.hooks.hook('render:html', (html) => {
    html.bodyPrepend.unshift('<!--email_off-->')
    html.bodyAppend.push('<!--/email_off-->')
  })
})
