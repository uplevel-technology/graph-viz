import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {GraphVizComponent} from './GraphVizComponent'

const data = {
  nodes: [
    {id: 'a', displayGroupIds: ['c1'], fill: 'coral'},
    {id: 'b', displayGroupIds: ['c1'], fill: 'orange'},
    {id: 'blue', displayGroupIds: ['c2'], fill: 'blue'},
    {id: 'lightblue', displayGroupIds: ['c2'], fill: 'lightblue'},
    {id: 'orange', displayGroupIds: ['c2'], fill: 'orange'},
    {id: 'green', displayGroupIds: ['c2'], fill: 'green'},
  ],
  links: [
    {source: 'a', target: 'b'},
    {source: 'blue', target: 'lightblue'},
    {source: 'blue', target: 'orange'},
    {source: 'blue', target: 'green'},
  ],
}

const groups = [
  {
    id: 'c1',
    visible: true,
    strength: 0.06,
    shape: 'convexHull' as const,
  },
  {
    id: 'c2',
    visible: true,
    shape: 'circle' as const,
  },
]

storiesOf('GraphVizComponent', module)
  .add('with groups', () => (
    <div style={{width: 700, height: 600}}>
      <GraphVizComponent
        nodes={data.nodes}
        links={data.links}
        tooltips={[]}
        groups={groups}
      />
    </div>
  ))
  .add('edit-mode', () => (
    <div style={{width: 700, height: 600}}>
      <GraphVizComponent
        editMode
        nodes={data.nodes}
        links={data.links}
        tooltips={[]}
      />
    </div>
  ))
