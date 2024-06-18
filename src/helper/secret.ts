import crypto from 'crypto'
import Base32 from '@lunacrew/base32'
import { SecretOptions } from '../types/Options'
import { SecretKey } from '../types/SecretKey'

/**
 * Generates a random ASCII string of the specified length (default 32)
 * from A-Z, a-z, 0-9, and symbols (if requested).
 * 
 * @param {number} length - The length of the generated string. Defaults to 32 if not provided.
 * @param {string} symbols - Whether to include symbols in the generated string. Defaults to false if not provided.
 * @returns The generated ASCII string.
 * @throws Error if the length is less than 1 or greater than 1024.
 */
const generateASCII = (length: number, symbols: boolean): string => {
  const bytes = crypto.randomBytes(length ?? 32)

  // validate length
  if (length < 1) throw new Error('@LunaCrew/mfa - length must be greater than or equal to 1')
  if (length > 1024) throw new Error('@LunaCrew/mfa - length must be less than or equal to 1024')

  let set = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
  if (symbols) {
    set += '!@#$%^&*()<>?/[]{},.:;'
  }

  let output = ''
  for (let i = 0, l = bytes.length; i < l; i++) {
    output += set[Math.floor(bytes[i] / 255.0 * (set.length - 1))]
  }
  return output
}

/**
 * Generates a secret key for multi-factor authentication with the set A-Z a-z 0-9 and symbols,
 * of the specified length (default 32).
 * Returns the secret key in ASCII, hexadecimal, and base32 format
 * 
 * @param {SecretOptions} options - The options for generating the secret key.
 * @param {string} options.label - The label for the account.
 * @param {string} options.issuer - The issuer for the account.
 * @param {string} options.length - The length of the generated secret key. Defaults to 32.
 * @param {boolean} options.otpAuthUrl - Whether to include the OTP authentication URL in the secret key. Defaults to false.
 * @param {boolean} options.symbols - Whether to include symbols in the generated secret key. Defaults to true.
 * @returns The generated secret key.
 * @throws Error if the length is less than 1 or greater than 1024.
 */
const generateSecret = (options: SecretOptions): SecretKey => {
  const length = options.length ?? 32
  const otpAuthUrl = options.otpAuthUrl ?? false
  const symbols = options.symbols ?? true

  // validate length
  if (length < 1) throw new Error('@LunaCrew/mfa - length must be greater than or equal to 1')
  if (length > 1024) throw new Error('@LunaCrew/mfa - length must be less than or equal to 1024')

  const secret = generateASCII(length, symbols)

  const secretKey: SecretKey = {
    ascii: secret,
    hex: Buffer.from(secret, 'ascii').toString('hex'),
    base32: Base32.encode(secret).toString().replace(/=/g, '')
  }

  if (otpAuthUrl) {
    secretKey.otpAuthUrl = {
      secret: secretKey.ascii,
      label: options.label,
      issuer: options.issuer
    }
  }

  return secretKey
}

export { generateSecret, generateASCII }
