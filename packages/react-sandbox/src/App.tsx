import React, {useEffect, useRef} from 'react'
import logo from './logo.svg'
import './App.css'
import {GraphVizComponent} from '@graph-viz/react'
import {DisplayGroup, DisplayNode, DisplayLink} from '@graph-viz/core'
import {GraphVisualization, VisualizationInputData} from '@graph-viz/core'
import data from './rostergroups.json'

// const DATA = {
//   nodes: [
//     {id: '1', fill: 'coral'},
//     {id: '2', fill: 'orange'},
//     {id: '3', displayGroupIds: ['c2'], fill: 'blue'},
//     {id: '4', displayGroupIds: ['c2'], fill: 'lightblue'},
//     {id: '5', displayGroupIds: ['c2'], fill: 'orange'},
//     {id: '6', displayGroupIds: ['c2'], fill: 'green'},
//   ],
//   links: [
//     {source: '1', target: '2'},
//     {source: '3', target: '4'},
//     {source: '3', target: '5'},
//     {source: '3', target: '6'},
//   ],
//   groups: [
//     {
//       id: 'c2',
//       visible: true,
//       shape: 'convexHull' as const,
//     },
//   ],
// }

const nodes = [
  ...new Set(data.flatMap(d => [d.username, d.jid.split('@')[0]])),
].map((d, i) => ({
  id: d,
  fill: `hsl(${Math.random() * 360}, 95%, 50%)`,
}))

export const DATA = {
  nodes,
  links: data.map(d => ({
    source: d.username,
    target: d.jid.split('@')[0],
  })),
  groups: [],
}

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // useEffect(() => {
  //   const viz = new GraphVisualization(
  //     {
  //       nodes: (DATA.nodes as unknown) as DisplayNode[],
  //       links: DATA.links,
  //       groups: (DATA.groups as unknown) as DisplayGroup[],
  //     },
  //     canvasRef.current!,
  //     500,
  //     500,
  //   )
  //
  //   // @ts-ignore
  //   // viz.onNodeHoverIn()
  // }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      {/*<canvas ref={canvasRef} />*/}
      <div className="App-content">
        <div className="App-graph-viz-container">
          <GraphVizComponent
            nodes={DATA.nodes}
            links={DATA.links}
            groups={DATA.groups}
          />
        </div>
      </div>
    </div>
  )
}

export default App
