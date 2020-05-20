import Ajv from 'ajv'
import simulationDataSchema from './generated-schema/SimulationData-schema.json'
import forceConfigSchema from './generated-schema/ForceConfig-schema.json'

const ajv = new Ajv()

export const validateSimulationData = ajv.compile(simulationDataSchema)
export const validateForceConfig = ajv.compile(forceConfigSchema)
