const HoleMark = `__SILVER$$MARK$$HOLE$$19981122__`

const isSameValue = (a, b) => a === b
const isNotSameValue = (a, b) => !isSameValue(a, b)

// A receiver for tagged template.
export const html = (strs, ...vals) => ({
  template: strs.join(HoleMark),
  strs,
  vals,
})

// Create update-able holes from a template.
export const updateable = (template) => {
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
      // Only process the Element and Comment Node because the dynamic variables only can appear in these places.
      case Node.ELEMENT_NODE:
        {
          // Attr <- Node <- EventTarget <- Object
          // Handle the variable in attribute.
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

// Commit (or Fill) values for the holes.
export const commit = (options) => {
  // strs for caching the template
  // vals for filling the values into the template
  const { strs, vals } = options

  const caches = commit.caches
  if (!caches.has(strs)) {
    caches.set(strs, updateable(options.template))
  }
  const updateableTemp = caches.get(strs)

  const { holes } = updateableTemp
  let hi = 0 // holes index
  let vi = 0 // values index
  while (hi < holes.length) {
    const hole = holes[hi]
    const val = vals[vi]
    switch (hole.type) {
      case 'ATTR':
        {
          hole.update(val)
          vi++
        }
        break
      case 'TEXT':
        {
          if (hole.isWhole) {
            hole.update(val)
            vi++
          } else {
            const need = hole.parts.length - 1
            const needVals = vals.slice(vi, vi + need)
            hole.update(needVals)
            vi += need
          }
        }
        break
    }
    hi++
  }

  return updateableTemp.contianer.content
}
commit.caches = new WeakMap()

// Get a renderer.
export const getRenderer = () => ({
  mount(view, target) {
    const dom = commit(view)
    target.appendChild(dom)
  },
  update(view) {
    commit(view)
  },
})
