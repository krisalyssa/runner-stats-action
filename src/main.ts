import * as core from '@actions/core'
import { exec } from 'node:child_process'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export function run(): void {
  try {
    exec('cat /proc/meminfo', (error, stdout, stderr) => {
      if (error) {
        core.error(`exec error: ${error.message}`)
        return
      }

      core.info(`stdout: ${stdout}`)
      core.error(`stderr: ${stderr}`)
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
