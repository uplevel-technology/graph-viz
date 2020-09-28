import * as Comlink from 'comlink'
import {ForceSimulation} from './ForceSimulation'

const workerUrl = require('worker-loader!./_ForceSimulationWorker')

export async function initSimulationWorker() {
  const SimulationClass = Comlink.wrap<typeof ForceSimulation>(
    new Worker(workerUrl, {type: 'module'}),
  )
  return await new SimulationClass()
}
