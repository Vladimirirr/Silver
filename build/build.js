import esbuild from 'esbuild'

import { toJson, getEsVersion } from './utils.js'

const build = async (entry, config = {}) => {
  // resolve config
  const {
    minify = false,
    sourcemap = false,
    outfile = 'index.dist.js',
    bannerMsg = '\n',
    buildingDate = new Date(),
  } = config

  // get resolved config
  const resolvedConfig = {
    bundle: true,
    entryPoints: [entry],
    outfile,
    minify,
    format: 'esm',
    target: getEsVersion(buildingDate, -3), // compat 3 versions early
    legalComments: 'inline', // to preserve copyright comments
    sourcemap: sourcemap && 'inline',
    banner: {
      js: bannerMsg,
    },
    define: {
      RUNNINGENV: toJson({
        env: 'production',
      }),
    },
  }
  // console.log('IN BUILDING: Using the following config to build.')
  // console.log(resolvedConfig)

  // begin building
  const res = await esbuild.build(resolvedConfig)
  // console.log('IN BUILDING: Building done with the following result.')
  // console.log(res)

  return res
}

export default build
