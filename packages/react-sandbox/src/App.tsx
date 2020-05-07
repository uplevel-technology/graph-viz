import React, {useEffect, useRef, useState} from 'react'
import logo from './logo.svg'
import './App.css'
import {GraphVizComponent} from '@graph-viz/react'

const DATA = {
  nodes: [
    {id: '1', fill: 'coral'},
    {id: '2', fill: 'orange'},
    {id: '3', displayGroupIds: ['c2'], fill: 'blue'},
    {id: '4', displayGroupIds: ['c2'], fill: 'lightblue'},
    {id: '5', displayGroupIds: ['c2'], fill: 'orange'},
    {id: '6', displayGroupIds: ['c2'], fill: 'green'},
    {id: '7', fill: 'green'},
    {id: '8', fill: 'yellow'},
    {id: '9', fill: 'pink'},
    {id: '10', fill: 'violet'},
  ],
  links: [
    {source: '1', target: '2'},
    {source: '3', target: '4'},
    {source: '3', target: '5'},
    {source: '3', target: '6'},
    {source: '1', target: '7'},
    {source: '1', target: '8'},
    {source: '1', target: '9'},
    {source: '1', target: '10'},
    {source: '6', target: '1'},
  ],
  groups: [
    {
      id: 'c2',
      visible: true,
      shape: 'convexHull' as const,
    },
  ],
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

  const [data, setData] = useState<any>(DATA)
  useEffect(() => {
    setTimeout(() => {
      setData({
        nodes: [...DATA.nodes, {id: 'black', fill: 'black'}],
        links: [...DATA.links, {source: 'black', target: '2'}],
        groups: [...DATA.groups],
      })
    }, 3000)
    // setTimeout(() => {
    //   setData({
    //     nodes: [
    //       ...DATA.nodes,
    //       // {id: 'black', fill: 'black'},
    //       {id: 'black', fill: 'pink'},
    //     ],
    //     links: [...DATA.links, {source: 'black', target: '2'}],
    //     groups: [...DATA.groups],
    //   })
    // }, 5000)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      {/*<canvas ref={canvasRef} />*/}
      <div className="App-content">
        <div className="App-graph-viz-container">
          <GraphVizComponent
            nodes={data.nodes}
            links={data.links}
            groups={data.groups}
          />
        </div>
      </div>
    </div>
  )
}

export default App
