const base = require('../../jest.config.base.js')

module.exports = {
  ...base,
  name: '@graph-viz/core',
  displayName: '@graph-viz/core',
  setupFiles: ['jest-canvas-mock'],
}
