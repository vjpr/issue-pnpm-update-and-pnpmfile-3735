module.exports = {
  hooks: {readPackage, afterAllResolved},
}

function afterAllResolved(lockfile, context) {
  return lockfile
}

function readPackage(pkg, ctx) {
  if (pkg.name === 'lodash') {
    pkg.dependencies = {
      ...pkg.dependencies,
      debug: undefined,
    }
  }

  return pkg
}
