// Commit (or Fill) values for the holes in a updateable template.
const commit = (options) => {
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

export default commit
