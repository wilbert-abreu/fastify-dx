#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { registerGlobals } from './runner.mjs'
import chokidar from 'chokidar'

if (isDev()) {
  let node

  registerGlobals()
  watch()

  log({ msg: 'Starting'})

  while (true) {
    node = getNode()
    try {
      await node
    } catch {
      log({ msg: 'Restarting'})
    }
  }

  function getNode () {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const listenPath = path.resolve(__dirname, 'test.mjs')    
    return $`${process.argv[0]} ${listenPath}`
  }

  function watch () {
    const watcher = chokidar.watch(['*.mjs', '*.js', '**/.mjs', '*/.js'], {
      ignoreInitial: true,
      ignored: ['**/node_modules/**']
    })
    watcher.on('all', () => {
      node.kill()
    })
  }

  function log ({ msg }) {
    console.log(JSON.stringify({
      level: 30,
      time: new Date().getTime(),
      pid: process.pid,
      hostname: os.hostname(),
      msg,
    }))
  }
}

await import('./test.mjs')

function isDev () {
  return process.argv.filter(cmd => !cmd.startsWith('-'))[2] === 'dev'
}