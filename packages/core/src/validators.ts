import 'reflect-metadata'
import Ajv from 'ajv'
import inputDataSchema from './generated-schema/VisualizationInputData-schema.json'
import configDataSchema from './generated-schema/ConfigurationOptions-schema.json'

const ajv = new Ajv()

/**
 * validator to validate data against VisualizationInputData schema
 */
export const validateInputData = ajv.compile(inputDataSchema)

/**
 * validator to validate data against ForceConfig schema
 */
export const validateConfig = ajv.compile(configDataSchema)

/**
 * symbol to attach to required params
 */
const requiredMetadataKey = Symbol('required')

/**
 * parameter decorator to flag a function param as required
 * @param target
 * @param propertyKey
 * @param parameterIndex
 */
export function required(
  target: Record<string, any>,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  const existingRequiredParameters: number[] =
    Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || []
  existingRequiredParameters.push(parameterIndex)
  Reflect.defineMetadata(
    requiredMetadataKey,
    existingRequiredParameters,
    target,
    propertyKey,
  )
}

/**
 * decorator that enables parameter validation on a function definition
 * using reflection
 * @param target
 * @param propertyName
 * @param descriptor
 */
export function validateArgs(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<Function>,
) {
  const method = descriptor.value
  descriptor.value = function(...args: any[]) {
    const requiredParameters: number[] = Reflect.getOwnMetadata(
      requiredMetadataKey,
      target,
      propertyName,
    )

    if (requiredParameters) {
      for (const parameterIndex of requiredParameters) {
        if (
          parameterIndex >= arguments.length ||
          args[parameterIndex] === undefined
        ) {
          throw new Error(
            `Call to ${target.constructor.name}.${propertyName}() missing required argument(s). Please refer to the docs for correct usage.`,
          )
        }
      }
    }

    return method!.apply(this, args)
  }
}

/**
 * decorator that enables parameter validation on a classConstructor definition
 * using reflection
 * @param target
 */
export function validateClassConstructor<T extends new (...args: any[]) => {}>(
  target: T,
): any {
  return class extends target {
    constructor(...args: any[]) {
      const requiredParameters: number[] = Reflect.getOwnMetadata(
        requiredMetadataKey,
        target,
      )

      if (requiredParameters) {
        for (const parameterIndex of requiredParameters) {
          if (
            parameterIndex >= arguments.length ||
            args[parameterIndex] === undefined
          ) {
            throw new Error(
              `${target.name} initialized with missing argument(s). Please refer to the docs for correct usage.`,
            )
          }
        }
      }

      super(...args)
    }
  }
}
