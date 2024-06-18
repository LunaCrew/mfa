import { CounterOptions } from '../types/Options'

/**
 * Calculates the counter value based on the given options.
 * A counter value converts a TOTP time into a counter value 
 * by finding the number of time steps that have
 * passed since the epoch to the current time.
 *
 * @param options - The options for calculating the counter value.
 * @param options.step - The time step in seconds. Defaults to 30.
 * @param options.time - The time to calculate the counter value for. Defaults to the Date.now().
 * @param options.epoch - The epoch time to calculate the counter value from. Defaults to 0.
 * @returns The calculated counter value.
 */
const counter = (options?: CounterOptions): number => {
  const step = options?.step ?? 30
  const time = options?.time ?? Date.now()
  const epoch = options?.epoch ?? 0

  // validate options
  if (step < 15) throw new Error('@LunaCrew/mfa - step must be at least 15 seconds')
  if (time < epoch) throw new Error('@LunaCrew/mfa - time must be greater than or equal to epoch')
  if (time < 0) throw new Error('@LunaCrew/mfa - time must be greater than or equal to 0')
  if (epoch < 0) throw new Error('@LunaCrew/mfa - epoch must be greater than or equal to 0')

  return Math.floor((time - epoch) / step / 1000)
}

export { counter }
