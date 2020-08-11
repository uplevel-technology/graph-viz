import React, {useEffect, useRef, useState} from 'react'
import logo from './logo.svg'
import './App.css'
import {GraphVizComponent} from '@graph-viz/react'
import {ForceConfig} from '@graph-viz/layouts'
import {GraphVisualization} from '@graph-viz/core'

const DATA = {
  nodes: [
    {id: '1', fill: 'coral'},
    {id: '2', fill: 'orange'},
    {id: '3', displayGroupIds: ['c2'], fill: 'blue'},
    {id: '4', displayGroupIds: ['c2'], fill: 'lightblue'},
    {id: '5', displayGroupIds: ['c2'], fill: 'orange'},
    {id: '6', displayGroupIds: ['c2'], fill: 'green'},
    {id: '7'},
    {id: '8'},
    {id: '9'},
    {id: '10'},
  ],
  links: [
    {source: '1', target: '2', directed: true, opacity: 0.5},
    {source: '3', target: '4', dashed: true},
    {source: '3', target: '5', label: 'hello world'},
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

const Sandbox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const visualizationRef = useRef<GraphVisualization | null>(null)

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
  const [config, setConfig] = useState<any>({
    nodes: {
      fill: 'pink',
    },
  })
  const [forceConfig, setForceConfig] = useState<ForceConfig>({
    groupStrength: 0,
    nodeCharge: -30,
  })

  useEffect(() => {
    setTimeout(() => {
      setData({
        nodes: [...DATA.nodes, {id: 'black', fill: 'black'}],
        links: [...DATA.links, {source: 'black', target: '2'}],
        groups: [...DATA.groups],
      })
    }, 3000)
    setTimeout(() => {
      setConfig({
        nodes: {
          fill: 'purple',
        },
      })
    }, 6000)

    // setTimeout(() => {
    //   setForceConfig({
    //     groupStrength: 2,
    //     nodeCharge: -300,
    //   })
    // }, 8000)
  }, [])

  const viz = visualizationRef.current

  function onInit(viz: GraphVisualization) {
    console.log('adding 2nd listener')
    viz.interaction.addEventListener('nodeHoverIn', 'custom', () => {
      console.log('hover In 2')
    })

    setTimeout(() => {
      console.log('removing 2nd listener')
      viz.interaction.removeEventListener('nodeHoverIn', 'custom')
    }, 5000)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      {/*<canvas ref={canvasRef} />*/}
      <div className="App-content">
        <div className="App-graph-viz-container">
          <GraphVizComponent
            dragMode={'select'}
            nodes={data.nodes}
            links={data.links}
            groups={data.groups}
            config={config}
            forceConfig={forceConfig}
            onInit={onInit}
          />
        </div>
      </div>
    </div>
  )
}

export default Sandbox
