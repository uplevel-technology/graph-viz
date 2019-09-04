'use strict'

import {GraphVisualization} from './GraphVisualization'
import {DisplayNode} from './Nodes'

const DATA = {
  nodes: [
    {id: '1', fill: 'coral'},
    {id: '2', fill: 'orange'},
    {id: '3', displayGroupIds: ['c2'], fill: 'blue'},
    {id: '4', displayGroupIds: ['c2'], fill: 'lightblue'},
    {id: '5', displayGroupIds: ['c2'], fill: 'orange'},
    {id: '6', displayGroupIds: ['c2'], fill: 'green'},
  ] as DisplayNode[],
  links: [
    {source: '1', target: '2'},
    {source: '3', target: '4'},
    {source: '3', target: '5'},
    {source: '3', target: '6'},
  ],
  groups: [
    {
      id: 'c2',
      visible: true,
      shape: 'convexHull' as const,
    },
  ],
}

describe('core', () => {
  describe('GraphVisualization', () => {
    it('initializes successfully with the correct arguments', () => {
      const canvas = document.createElement('canvas')
      const viz = new GraphVisualization(DATA, canvas, 100, 100)

      expect(viz).toBeTruthy()
    })
  })
})
