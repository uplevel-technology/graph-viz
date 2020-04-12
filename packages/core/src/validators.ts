import 'reflect-metadata'

const requiredMetadataKey = Symbol('required')

export function required(
  // tslint:disable-next-line:ban-types
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

export function validate(
  target: any,
  propertyName: string,
  // tslint:disable-next-line:ban-types
  descriptor: TypedPropertyDescriptor<Function>,
) {
  const method = descriptor.value
  descriptor.value = function() {
    const requiredParameters: number[] = Reflect.getOwnMetadata(
      requiredMetadataKey,
      target,
      propertyName,
    )

    if (requiredParameters) {
      for (const parameterIndex of requiredParameters) {
        if (
          parameterIndex >= arguments.length ||
          arguments[parameterIndex] === undefined
        ) {
          throw new Error(
            `Call to ${target.constructor.name}.${propertyName}() missing required argument(s). Please refer to the docs for correct usage.`,
          )
        }
      }
    }

    return method!.apply(this, arguments)
  }
}

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
            arguments[parameterIndex] === undefined
          ) {
            throw new Error(
              `${target.constructor.name} initialized with missing argument(s). Please refer to the docs for correct usage.`,
            )
          }
        }
      }

      super(...args)
    }
  }
}
