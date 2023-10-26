/* eslint-disable import/no-extraneous-dependencies */
const prettier = require('prettier/standalone')
const babel = require('prettier/plugins/babel')
const estree = require('prettier/plugins/estree')
const path = require('path')
const fs = require('fs')
const util = require('util')
const json = require('../package.json')

const writeFile = util.promisify(fs.writeFile)

const plugins = [babel, estree]

;(async () => {
  const { prettier: config } = json
  json.main = 'index.js'
  delete json.eslintConfig
  delete json.prettier
  const output = await prettier.format(JSON.stringify(json), {
    parser: 'json',
    plugins,
    ...config,
  })
  await writeFile(
    path.resolve(__dirname, '../dist/package.json'),
    output,
    'utf8',
  )
})()
