import * as Comlink from 'comlink'
import {ForceSimulation} from './ForceSimulation'

export async function initSimulationWorker() {
  const SimulationClass = Comlink.wrap<typeof ForceSimulation>(
    new Worker('./ForceSimulation.ts', {type: 'module'}),
  )
  return await new SimulationClass()
}
