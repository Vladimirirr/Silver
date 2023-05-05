export const toJson = JSON.stringify
export const fromJson = JSON.parse

export const getBuildingTime = (d) => d.toUTCString()

export const getEsVersion = (d, offset = 0) => {
  const currentYear = d.getFullYear()
  const lowestVersion = 2015 // ECMAScript2015 = ES6
  const targetVersion = currentYear + offset // targetVersion manipulated by offset
  const resolvedVersion = Math.max(lowestVersion, targetVersion)
  return `es${resolvedVersion}`
}
