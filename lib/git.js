/**
 * Fetch sources via Git.
 *
 * @author Jared Allard <jaredallard@outlook.com>
 * @license MIT
 * @version 1
 */

const nodegit = require('nodegit')
const fs      = require('fs-extra')
const debug   = require('debug')('magisk.it:git')
const path    = require('path')

const required = () => {
  throw new Erorr('Missing Required Param.')
}

class Git {
  constructor() {
    this.version = 1
  }

  /**
   * Download repository.
   *
   * @param  {String} url               Url to download from
   * @param  {String} folder            Location to download into.
   * @return {Promise}                  Promise
   */
  async download(url = required(), folder = required()) {
    const exists = await fs.exists(path.join(folder, 'config.sh'))

    if(exists) return this.update(folder)

    debug('download', url)
    await nodegit.Clone(`https://github.com/${url}`, folder)
  }

  /**
   * Update a repository.
   *
   * @param  {String} folder              Location to update in.
   * @return {Promise}                    Promise
   */
  async update(folder = required()) {
    debug('update', folder)

    const repo = await nodegit.Repository.open(folder)
    await repo.mergeBranches("master", "origin/master")

    debug('update', 'done pulling')
  }
}

module.exports = Git
