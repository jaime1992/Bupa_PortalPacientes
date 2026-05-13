module.exports = {
  apps: [{
    name: 'n8n',
    script: 'n8n',
    args: 'start',
    env: {
      NODE_FUNCTION_ALLOW_BUILTIN: '*',
      N8N_PORT: '5678'
    }
  }]
}
