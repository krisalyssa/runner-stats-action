import * as core from '@actions/core'
import { exec } from 'node:child_process'

/**
 * Collect and report system statistics at the start of a job.
 *
 * See https://www.kernel.org/doc/html/latest/filesystems/proc.html for more information about the /proc filesystem and what you can read from it.
 */
export function run(): void {
  const loadAverageReport = getReport('cat /proc/loadavg')
  if (loadAverageReport !== undefined) {
    core.info('Load average:')
    core.info(loadAverageReport)
  }

  const memInfoReport = getReport('cat /proc/meminfo')
  if (memInfoReport !== undefined) {
    core.info('Memory:')
    core.info(memInfoReport)

    core.saveState('memInfo', parseMemInfoReport(memInfoReport))
  }

  const statReport = getReport('cat /proc/stat')
  if (statReport !== undefined) {
    core.info('Kernel:')
    core.info(statReport)
  }
}

/**
 * Collect and report system statistics at the end of a job.
 */
export function runOnPost(): void {
  const loadAverageReport = getReport('cat /proc/loadavg')
  if (loadAverageReport !== undefined) {
    core.info('Load average:')
    core.info(loadAverageReport)
  }

  const memInfoReport = getReport('cat /proc/meminfo')
  if (memInfoReport !== undefined) {
    core.info('Memory:')
    core.info(memInfoReport)

    const memInfoBefore: Map<string, number | undefined> = JSON.parse(core.getState('memInfo'))
    const memInfoAfter: Map<string, number | undefined> = parseMemInfoReport(memInfoReport)

    for (const [key, valueBefore] of memInfoBefore) {
      const valueAfter = memInfoAfter.get(key)
      core.info(`${valueBefore}  ${valueAfter}  ${(valueBefore !== undefined && valueAfter !== undefined) ? valueAfter - valueBefore : ''}`)
    }
  }

  const statReport = getReport('cat /proc/stat')
  if (statReport !== undefined) {
    core.info('Kernel:')
    core.info(statReport)
  }
}

function getReport(cmd: string): string | undefined {
  let output: string | undefined

  try {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        core.error(`exec error: ${error.message}`)
        return
      }

      if (stdout.length > 0) {
        output = stdout
      }

      if (stderr.length > 0) {
        core.error('stderr:')
        core.error(`${stderr}`)
      }
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }

  return output
}

function parseMemInfoReport(report: string): Map<string, number | undefined> {
  const info: Map<string, number | undefined> = new Map()
  for (const line of report.split("\n")) {
    const parts = line.split(/\s*:\s*/)
    info.set(parts[0], parseValue(parts[1]))
  }
  return info
}

function parseValue(valStr: string): number | undefined {
  const m = valStr.match(/(\d+)\s*(\S+)?/)
  if (m) {
    let value = Number.parseInt(m[1])
    if (m.length > 2) {
      switch (m[2]) {
        case 'kB':
          value = value * 1024
          break

        default:
          break
      }
    }

    return value
  }

  return undefined
}