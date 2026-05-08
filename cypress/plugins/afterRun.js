const http = require('http')

const SPECS_CRITICOS = ['login', 'pago', 'checkout', 'auth']
const WF18_WEBHOOK   = 'http://localhost:5678/webhook/cypress-critical'
const WF19_WEBHOOK   = 'http://localhost:5678/webhook/cypress-confluence'

function notificarConfluence(payload) {
  const body = JSON.stringify(payload)
  return new Promise((resolve) => {
    const req = http.request(WF19_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, res => { res.resume(); res.on('end', resolve) })
    req.on('error', e => {
      console.warn(`[afterRun] WF-1.9 Confluence no disponible: ${e.message}`)
      resolve()
    })
    req.write(body)
    req.end()
  })
}

function notificarFalloCritico(specs) {
  const payload = JSON.stringify({
    tipo: 'fallo_critico',
    timestamp: new Date().toISOString(),
    ambiente: 'QA',
    total_fallos_criticos: specs.reduce((a, s) => a + s.fallos, 0),
    specs,
  })
  return new Promise((resolve) => {
    const req = http.request(WF18_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
    }, res => { res.resume(); res.on('end', resolve) })
    req.on('error', e => {
      console.warn(`[afterRun] WF-1.8 no disponible: ${e.message}`)
      resolve()
    })
    req.write(payload)
    req.end()
  })
}

module.exports = async function afterRun(results) {
  const EMAIL_SERVER = 'http://localhost:3025/run-cypress-report'
  const fecha = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })

  // ── Detección de specs críticos fallados → WF-1.8 ─────────────────────────
  const specsCriticosFallados = (results.runs || [])
    .filter(r => r.stats?.failures > 0 &&
      SPECS_CRITICOS.some(k => (r.spec?.relative || '').toLowerCase().includes(k)))
    .map(r => ({
      spec: r.spec?.relative || 'unknown',
      fallos: r.stats.failures || 0,
      tests: (r.tests || [])
        .filter(t => t.state === 'failed')
        .map(t => ({
          titulo: Array.isArray(t.title) ? t.title.join(' > ') : (t.title || ''),
          error: t.displayError ? String(t.displayError).substring(0, 200) : '',
        })),
    }))

  if (specsCriticosFallados.length > 0) {
    console.log(`\n[afterRun] 🚨 ${specsCriticosFallados.length} spec(s) crítico(s) fallado(s) → notificando WF-1.8`)
    await notificarFalloCritico(specsCriticosFallados)
  }
  // ── Fin detección críticos ─────────────────────────────────────────────────

  // Construir payload limpio para el email-server
  const runs = (results.runs || []).map(run => {
    const specFile = (run.spec?.relative || 'unknown').split('/').pop().split('\\').pop()
    return {
      file:  specFile,
      stats: run.stats || {},
      tests: (run.tests || []).map(t => ({
        title:    t.title ? (Array.isArray(t.title) ? t.title[t.title.length - 1] : t.title) : '',
        state:    t.state    || '',
        duration: t.duration || 0,
        err:      t.displayError ? String(t.displayError).substring(0, 150) : null,
      })),
    }
  })

  const totalPasses   = runs.reduce((a, r) => a + (r.stats.passes   || 0), 0)
  const totalFailures = runs.reduce((a, r) => a + (r.stats.failures || 0), 0)

  console.log(`\n[afterRun] ${runs.length} spec(s) — ✅ ${totalPasses} ❌ ${totalFailures}`)

  const payloadObj = {
    suite:   `${runs.length} spec(s)`,
    stats:   {
      tests:    results.totalTests    || 0,
      passes:   results.totalPassed   || totalPasses,
      failures: results.totalFailed   || totalFailures,
      pending:  results.totalPending  || 0,
      duration: results.totalDuration || 0,
    },
    results: runs,
    fecha,
  }

  // Notifica WF-1.9 → Confluence (cada ejecución, sin condición)
  await notificarConfluence(payloadObj)

  const payload = JSON.stringify(payloadObj)

  return new Promise((resolve) => {
    const req = http.request(EMAIL_SERVER, {
      method:  'POST',
      headers: {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, res => {
      let body = ''
      res.on('data', c => body += c)
      res.on('end', () => {
        console.log(`[afterRun] Email-server respondió: ${body}`)
        resolve()
      })
    })

    req.on('error', e => {
      console.error(`[afterRun] Error al contactar email-server: ${e.message}`)
      resolve()
    })

    req.write(payload)
    req.end()
  })
}
