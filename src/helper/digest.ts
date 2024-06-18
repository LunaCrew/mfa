import crypto from 'crypto'
import Base32 from '@lunacrew/base32'
import { DigestOptions } from '../types/Options'

/**
 * Calculates the digest of a secret using the specified options.
 *
 * @param {DigestOptions} options - The options for calculating the digest.
 * @param {string} options.secret - The shared secret key.
 * @param {number} options.counter - The counter for the digest.
 * @param {'SHA1' | 'SHA256' | 'SHA512'} options.algorithm - The algorithm for the digest. Defaults to SHA1.
 * @param {'ascii' | 'hex' | 'base32'} options.encoding - The encoding for the secret. Defaults to ascii.
 * @returns The calculated digest as a Buffer.
 * @throws Error if the algorithm is not supported.
 */
const digest = (options: DigestOptions): Buffer => {
  const encoding = options.encoding ?? 'ascii'
  const algorithm = options.algorithm ?? 'SHA1'
  let secret: string | Buffer = options.secret
  let secretBufferSize: number = 0

  // convert secret to buffer
  if (!Buffer.isBuffer(secret)) {
    if (encoding === 'base32') {
      secret = Base32.decode(options.secret).toString()
    }

    secret = Buffer.from(secret, encoding as BufferEncoding)
  }

  // set secretBufferSize
  switch (algorithm) {
    case 'SHA1':
      secretBufferSize = 20 // 160 bits = 20 bytes
      break
    case 'SHA256':
      secretBufferSize = 32 // 256 bits = 32 bytes
      break
    case 'SHA512':
      secretBufferSize = 64 // 512 bits = 64 bytes
      break
    default:
      throw new Error(`@LunaCrew/mfa - Unsupported algorithm: ${algorithm}. Supported algorithms are SHA1, SHA256, and SHA512`)
  }

  // ensure secret buffer has size of secretBufferSize
  if (secretBufferSize && (secret.length !== secretBufferSize)) {
    secret = Buffer.from(Array(Math.ceil(secretBufferSize / secret.length) + 1)
      .join(secret.toString('hex')).slice(0, secretBufferSize))
  }

  // create buffer from counter
  const buffer = Buffer.from(Array(8))
  let counter = options.counter
  for (let i = 0; i < 8; i++) {
    // mask 0xff over number to get last 8
    buffer[7 - i] = counter & 0xff

    // shift bits 8 positions to right and get ready to loop over the next batch of 8
    counter = counter >> 8
  }

  // initialize hmac with secret and algorithm
  const hmac = crypto.createHmac(algorithm, secret)

  // update hmac with counter
  hmac.update(buffer)

  // return the digest
  return hmac.digest()
}

export { digest }
