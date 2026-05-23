const http = require('node:http')
const { spawn } = require('node:child_process')

const devUrl = 'http://127.0.0.1:3000/'

function spawnProcess(command, args, options = {}) {
  return spawn(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  })
}

function waitForServer(url, timeoutMs = 30000) {
  const started = Date.now()

  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, (res) => {
        res.resume()
        resolve()
      })

      req.on('error', () => {
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Vite server did not start at ${url}`))
          return
        }
        setTimeout(check, 300)
      })
    }

    check()
  })
}

async function main() {
  const vite = spawnProcess('npm', ['run', 'dev', '--', '--host', '127.0.0.1'])

  const shutdown = () => {
    vite.kill()
    process.exit()
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  await waitForServer(devUrl)

  const electron = spawnProcess('npx', ['electron', '.'], {
    env: { ...process.env, VITE_DEV_SERVER_URL: devUrl },
  })

  electron.on('exit', (code) => {
    vite.kill()
    process.exit(code ?? 0)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
