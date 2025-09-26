module.exports = {
  apps: [{
    name: 'lyrics-app',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 7924
    },
    instances: 1,
    exec_mode: 'fork'
  }]
};