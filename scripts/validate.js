/* eslint-disable import/no-extraneous-dependencies */
const child = require('child_process')
const util = require('util')
const invariant = require('invariant')
const fs = require('fs')
const path = require('path')

const exec = util.promisify(child.exec)
const readFile = util.promisify(fs.readFile)

;(async () => {
  const json = JSON.parse(
    await readFile(path.resolve(__dirname, '../dist/package.json'), 'utf8'),
  )
  const { stdout: rawTags } = await exec('git tag --points-at HEAD')
  const tags = rawTags.trim().split('\n')
  invariant(tags.includes(`v${json.version}`), 'Version mismatch')
  // eslint-disable-next-line no-console
  console.log('Validation: OK')
})()
