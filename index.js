/**
 * Magisk.it - Build Magisk Modules
 *
 * @author Jared Allard <jaredallard@outlook.com>
 * @license MIT
 * @version 1
 */

const express  = require('express')
const debug    = require('debug')('magisk.it')
const path     = require('path')
const fs       = require('fs')
const archiver = require('archiver-promise')

const folder  = path.join(__dirname, 'repos')

// Download Methods
const Git = require('./lib/git.js')
const git = new Git()

const app = express()

app.use(express.static('html'))

app.get('/builds/:username/:repo', async (req, res) => {
  const real_url   = `${req.params.username}/${req.params.repo}`

  debug('real_url', real_url)
  if(!real_url) return res.status(404).send()

  const url        = real_url
  const storage    = url.split('/')

  const module_url = `${storage[0]}.${storage[1]}`
  const dir        = path.join(folder, module_url)

  debug('fetch', url, dir)

  try {
    await git.download(url, dir)
  } catch(err) {
    return res.status(404).send()
  }

  // operate on it
  debug('zip', 'creating zip archive')
  const zipArchive = archiver('zip', {
    zlib: { level: 9 }
  });

  res.setHeader('Content-disposition', `attachment; filename=${storage[1]}.zip`);
  res.setHeader("Content-type", "application/zip, application/octet-stream")

  // create the archive
  zipArchive.pipe(res);
  zipArchive.directory(dir, false);
  zipArchive.finalize()
})

app.listen(8080)
