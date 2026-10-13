import { parse } from '@vue/compiler-sfc'
import { baseParse } from '@vue/compiler-dom'

// Keep long utility lists readable instead of hiding an entire component on one line.
export function wrapTailwind(source) {
  const template = parse(source).descriptor.template
  if (!template) return source
  const edits = []
  function visit(node) {
    if (node.type === 1) {
      const attribute = node.props.find((prop) => prop.type === 6 && prop.name === 'class')
      if (attribute?.value && attribute.value.content.trim().length > 100) {
        const classes = attribute.value.content.trim().split(/\s+/)
        const offset = template.loc.start.offset + attribute.loc.start.offset
        const indent = source.slice(source.lastIndexOf('\n', offset) + 1, offset).match(/^\s*/)[0]
        const lines = []
        let line = ''
        for (const name of classes) {
          if (line && indent.length + line.length + name.length > 94) {
            lines.push(line)
            line = ''
          }
          line += (line ? ' ' : '') + name
        }
        if (line) lines.push(line)
        const text =
          'class="\n' + lines.map((line) => indent + '  ' + line).join('\n') + '\n' + indent + '"'
        edits.push({
          start: offset,
          end: template.loc.start.offset + attribute.loc.end.offset,
          text,
        })
      }
    }
    for (const child of node.children || []) visit(child)
  }
  visit(baseParse(template.content))
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    source = source.slice(0, edit.start) + edit.text + source.slice(edit.end)
  }
  return source
}
