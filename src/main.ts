import * as core from '@actions/core'
import { exec } from 'node:child_process'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export function run(): void {
  loadavg()
  meminfo()
  stat()
}

function loadavg(): void {
  try {
    exec('cat /proc/loadavg', (error, stdout, stderr) => {
      if (error) {
        core.error(`exec error: ${error.message}`)
        return
      }

      if (stdout.length > 0) {
        core.info('/proc/loadavg:')
        core.info(`${stdout}`)
      }

      if (stderr.length > 0) {
        core.error('stderr:')
        core.error(`${stderr}`)
      }
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function meminfo(): void {
  try {
    exec('cat /proc/meminfo', (error, stdout, stderr) => {
      if (error) {
        core.error(`exec error: ${error.message}`)
        return
      }

      if (stdout.length > 0) {
        core.info('/proc/meminfo:')
        core.info(`${stdout}`)
      }

      if (stderr.length > 0) {
        core.error('stderr:')
        core.error(`${stderr}`)
      }
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function stat(): void {
  try {
    exec('cat /proc/stat', (error, stdout, stderr) => {
      if (error) {
        core.error(`exec error: ${error.message}`)
        return
      }

      if (stdout.length > 0) {
        core.info('/proc/stat:')
        core.info(`${stdout}`)
      }

      if (stderr.length > 0) {
        core.error('stderr:')
        core.error(`${stderr}`)
      }
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
