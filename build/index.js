import path from 'path'
import fs from 'fs/promises'

import { appName } from './constants.js'
import { fromJson, getBuildingTime } from './utils.js'

import build from './build.js'

const packagePath = path.resolve('package.json')

const getOutfilePath = (name, version, minify) => {
  const minifyPart = minify ? '.min' : ''
  const fileName = `${name}.${version}.dist${minifyPart}.js`
  return path.resolve('dist', fileName)
}

const begin = async () => {
  const packageContent = await fs.readFile(packagePath, {
    // return the text(JSON data) rather than data buffer
    encoding: 'utf-8',
  })
  const packageData = fromJson(packageContent)

  const buildingDate = new Date()

  const {
    main: mainEntry,
    name: outfileName,
    version,
    description,
    author,
    homepage,
    license,
  } = packageData
  const bannerMsg = `
/*!
  * ${appName} v${version} (${getBuildingTime(buildingDate)})
  * Description: ${description}
  * Author: ${author}
  * Home: ${homepage}
  * License: ${license}
  * ****
  */
`
  const res = await build(path.resolve('src', mainEntry), {
    minify: true,
    outfile: getOutfilePath(outfileName, version, true),
    bannerMsg,
    buildingDate,
  })
  0 && console.log(res) // It may use when debugging, but for now, we closed it.
  console.log('Build done.')
}

begin()
