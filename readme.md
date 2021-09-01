## `cd packages/foo`

## `pnpm add lodash`

```
lockfileVersion: 5.3

importers:

  packages/foo:
    specifiers:
      lodash: ^4.17.21
    dependencies:
      lodash: 4.17.21

packages:

  /lodash/4.17.21:
    resolution: {integrity: sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==}
    dev: false
```

## Modify pnpmfile

```
# .pnpmfile.cjs

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
      debug: '*',
    }
  }

  return pkg
}
```

## `pnpm install`

Nothing. Good.

## `pnpm update`

```
lockfileVersion: 5.3

importers:

  packages/foo:
    specifiers:
      lodash: ^4.17.21
    dependencies:
      lodash: 4.17.21

packages:

  /debug/4.3.2:
    resolution: {integrity: sha512-mOp8wKcvj7XxC78zLgw/ZA+6TSgkoE2C/ienthhRD298T7UNwAg9diBpLRxC0mOezLl4B0xV7M0cCO6P/O0Xhw==}
    engines: {node: '>=6.0'}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true
    dependencies:
      ms: 2.1.2
    dev: false

  /lodash/4.17.21:
    resolution: {integrity: sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==}
    dependencies:
      debug: 4.3.2
    transitivePeerDependencies:
      - supports-color
    dev: false

  /ms/2.1.2:
    resolution: {integrity: sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==}
    dev: false

```

## Modify pnpmfile

```
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
      //debug: '*',
    }
  }

  return pkg
}
```

## `pnpm update`

```
lockfileVersion: 5.3

importers:

  packages/foo:
    specifiers:
      lodash: ^4.17.21
    dependencies:
      lodash: 4.17.21

packages:

  /debug/4.3.2:
    resolution: {integrity: sha512-mOp8wKcvj7XxC78zLgw/ZA+6TSgkoE2C/ienthhRD298T7UNwAg9diBpLRxC0mOezLl4B0xV7M0cCO6P/O0Xhw==}
    engines: {node: '>=6.0'}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true
    dependencies:
      ms: 2.1.2
    dev: false

  /lodash/4.17.21:
    resolution: {integrity: sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==}
    dependencies:
      debug: 4.3.2
    dev: false

  /ms/2.1.2:
    resolution: {integrity: sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==}
    dev: false
```

## tree node_modules/.pnpm -L 3

```
node_modules/.pnpm
├── debug@4.3.2
│   └── node_modules
│       ├── debug
│       └── ms -> ../../ms@2.1.2/node_modules/ms
├── lock.yaml
├── lodash@4.17.21
│   └── node_modules
│       ├── debug -> ../../debug@4.3.2/node_modules/debug
│       └── lodash
├── ms@2.1.2
│   └── node_modules
│       └── ms
└── node_modules
    ├── debug -> ../debug@4.3.2/node_modules/debug
    ├── lodash -> ../lodash@4.17.21/node_modules/lodash
    └── ms -> ../ms@2.1.2/node_modules/ms
```

Note that `debug` still exists as a dep of `lodash`.

## `cd <root>` `pnpm -r update --depth=99` / `pnpm i`

Doesn't fix it.

There is no way to fix it without manually modifying the lockfile. This can be a huge source of really hard-to-trace bugs.
