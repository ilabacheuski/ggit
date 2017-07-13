const la = require('lazy-ass')
const is = require('check-more-types')
const schemaShot = require('schema-shot')
const snapshot = require('snap-shot')
const { stubExecOnce } = require('stub-spawn-once')
const { stripIndent } = require('common-tags')

/* global describe, it, beforeEach, afterEach */
describe('blame', () => {
  const blame = require('..').blame

  it('is a function', () => {
    la(is.fn(blame))
  })

  it('gets blame for 1 line of this file', () => {
    const line = 1
    return schemaShot(blame(__filename, line))
  })

  it('mocks exec and parses output', () => {
    // line 10000 does NOT exist in this file!
    const line = 10000
    const cmd = `git blame --porcelain -L ${line},${line} ${__filename}`
    const output = stripIndent`
      adfb30d5888bb1eb9bad1f482248edec2947dab6 ${line} ${line} 1
      author Gleb Bahmutov
      author-mail <gleb.bahmutov@gmail.com>
      author-time 1499944626
      author-tz -0400
      committer Gleb Bahmutov
      committer-mail <gleb.bahmutov@gmail.com>
      committer-time 1499944626
      committer-tz -0400
      summary mock commit
      filename spec/blame-spec.js
      this is mock line ${line}
    `
    stubExecOnce(cmd, output)
    // can use exact snapshot here, because the output will always be
    // the same! See __snapshots__/blame-spec.js.snap-shot
    return snapshot(blame(__filename, line))
  })

  it('can grab blame for entire file', () => {
    return schemaShot(blame(__filename))
  })

  describe('non-existent file', () => {
    const fs = require('fs')
    const sinon = require('sinon')
    const path = require('path')

    const line = 42
    const file = 'foo.txt'
    const fullFilename = path.resolve(file)

    beforeEach(() => {
      sinon.stub(fs, 'existsSync').withArgs(file).returns(true)
      const cmd = `git blame --porcelain -L ${line},${line} ${fullFilename}`
      const output = stripIndent`
        adfb30d5888bb1eb9bad1f482248edec2947dab6 ${line} ${line} 1
        author Gleb Bahmutov
        author-mail <gleb.bahmutov@gmail.com>
        author-time 1499944626
        author-tz -0400
        committer Gleb Bahmutov
        committer-mail <gleb.bahmutov@gmail.com>
        committer-time 1499944626
        committer-tz -0400
        summary mock commit
        filename spec/blame-spec.js
        this is mock line ${line}
      `
      stubExecOnce(cmd, output)
    })
    afterEach(() => {
      fs.existsSync.restore()
    })

    it('can mock blame for non-existent file', () => {
      return snapshot(blame(file, line))
    })
  })
})
