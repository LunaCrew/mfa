import url from 'url'
import Base32 from '@lunacrew/base32'
import { OtpAuthOptions } from '../types/Options'

/**
 * Generate a Google Authenticator-compatible otpauth:// URL for passing the
 * secret to a mobile device to install the secret.
 *
 * Authenticator considers TOTP codes valid for 30 seconds. Additionally,
 * the app presents 6 digits codes to the user. According to the
 * documentation, the period and number of digits are currently ignored by
 * the app.
 *
 * To generate a suitable QR Code, pass the generated URL to a QR Code
 * generator, such as the `qr-image` module.
 * 
 * @param {OtpAuthOptions} options - The options for generating the OTP authentication URL.
 * @param {string} options.secret - The shared secret key.
 * @param {string} options.label - The label for the account.
 * @param {string} options.issuer - The issuer for the account.
 * @param {'totp' | 'hotp'} options.type - The type of OTP. Defaults to totp.
 * @param {number} options.period - The period for the OTP. Defaults to 30.
 * @param {number} options.digits - The number of digits for the OTP. Defaults to 6.
 * @param {'SHA1' | 'SHA256' | 'SHA512'} options.algorithm - The algorithm for the OTP. Defaults to SHA1.
 * @param {'ascii' | 'hex' | 'base32'} options.encoding - The encoding for the secret. Defaults to ascii.
 * @returns The generated OTP authentication URL.
 * @throws Error if the provided options are invalid.
 * @see https://github.com/google/google-authenticator/wiki/Key-Uri-Format
 */
const otpAuthUrl = (options: OtpAuthOptions): string => {
  let secret = options.secret
  const type = options.type ?? 'totp'
  const period = options.period ?? 30
  const digits = options.digits ?? 6
  const algorithm = options.algorithm ?? 'SHA1'

  // validate options
  if (type !== 'totp' && type !== 'hotp') throw new Error('@LunaCrew/mfa - type must be totp or hotp')
  if (digits !== 6 && digits !== 8) throw new Error('@LunaCrew/mfa - digits must be 6 or 8')
  if (algorithm !== 'SHA1' && algorithm !== 'SHA256' && algorithm !== 'SHA512') throw new Error('@LunaCrew/mfa - algorithm must be SHA1, SHA256, or SHA512')
  if (period < 15) throw new Error('@LunaCrew/mfa - period must be at least 15 seconds')

  // require counter for hotp
  if (type === 'hotp' && !options.counter) {
    throw new Error('counter is required for hotp')
  }

  // encode secret to base32
  if (options.encoding !== 'base32') {
    const buffer = Buffer.from(secret, options.encoding)
    secret = Base32.encode(buffer.toString()).toString()
  }

  const query = {
    issuer: options.issuer,
    algorithm: algorithm,
    digits: digits,
    period: period,
    secret: secret
  }

  return url.format({
    protocol: 'otpauth',
    slashes: true,
    hostname: type,
    pathname: encodeURIComponent(options.label),
    query: query
  })
}

export { otpAuthUrl }
