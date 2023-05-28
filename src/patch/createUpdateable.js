import { isSameValue, isNotSameValue } from '../utils/internal.js'

// Create a updateable template by marking dynamic value holes.
const createUpdateable = (template) => {
  // Things in template element will not trigger browser's HTML syntax checking.
  const templateEl = document.createElement('template')
  templateEl.innerHTML = template

  const it = document.createNodeIterator(templateEl.content)
  it.nextNode() // skip the root node on first

  const holes = []
  let current = null
  let step = 1
  while ((current = it.nextNode())) {
    step++
    const refer = current
    switch (current.nodeType) {
      // Only process the Element and Comment Node because the dynamic values only can appear in these places.
      case Node.ELEMENT_NODE:
        {
          // Attr <- Node <- EventTarget <- Object
          // Handle these in attribute.
          const attrs = current.attributes
          Array.from(attrs).forEach((attr) => {
            if (attr.value == HoleMark) {
              const hole = {
                type: 'ATTR',
                step,
                refer,
                update: (v) => {
                  const oldData = attr.value
                  if (isNotSameValue(oldData, v)) {
                    attr.value = v
                  }
                },
              }
              holes.push(hole)
            }
          })
        }
        break
      case Node.TEXT_NODE:
        {
          // Text <- CharacterData <- Node <- EventTarget <- Object
          // Treat all dynamic and static texts as one.
          if (current.data.includes(HoleMark)) {
            const isWhole = isSameValue(current.data, HoleMark)
            const parts = isWhole ? null : current.data.split(HoleMark)
            const hole = {
              type: 'TEXT',
              step,
              refer,
              isWhole,
              parts,
              update: (v) => {
                // v: string | string[]
                if (!isWhole) {
                  const vals = v.slice()
                  vals.push('')
                  const newData = parts.reduce(
                    (acc, cur, idx) => (acc += cur + vals[idx]),
                    ''
                  )
                  v = newData
                }
                const oldData = refer.data
                if (isNotSameValue(oldData, v)) {
                  refer.data = v
                }
              },
            }
            holes.push(hole)
          }
        }
        break
    }
  }

  return {
    contianer: templateEl,
    template,
    holes,
  }
}

export default createUpdateable
