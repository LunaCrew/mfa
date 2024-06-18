
import { HotpOptions } from '../types/Options'
import { digest } from '../helper/digest'

export default class Hotp {
  /**
   * Generates a HOTP (HMAC-based One-Time Password) token. 
   * Specify the key and counter, and receive the one-time password for that counter position as a string.
   * You can also specify a token length, as well as the encoding 
   * (ASCII, hexadecimal, or base32) and the hashing algorithm to use (SHA1, SHA256, SHA512).
   * 
   * @param options - The options for generating the HOTP code.
   * @param options.secret - The secret key used to generate the HOTP code.
   * @param options.token - The token used to generate the HOTP code.
   * @param options.counter - The counter value used to generate the HOTP code.
   * @param options.digits - The number of digits in the HOTP code.
   * @param options.window - The number of steps to check before and after the counter.
   * @param options.algorithm - The algorithm used to generate the HOTP code.
   * @param options.encoding - The encoding used to generate the HOTP code.
   * @returns The generated HOTP code.
   * @see RFC4226 5.4 https://www.rfc-editor.org/rfc/rfc4226#section-5.4
   */
  static readonly generate = (options: HotpOptions): string => {
    const digits = options.digits ?? 6
    const digestedOptions = digest({
      counter: options.counter,
      secret: options.secret,
      algorithm: options.algorithm,
      encoding: options.encoding
    })

    // compute HOTP offset - last 4 bits of the digest
    const offset = digestedOptions[digestedOptions.length - 1] & 0xf

    // calculate binary code (RFC4226 5.4)
    let code: string | number =
      (digestedOptions[offset] & 0x7f) << 24 |
      (digestedOptions[offset + 1] & 0xff) << 16 |
      (digestedOptions[offset + 2] & 0xff) << 8 |
      (digestedOptions[offset + 3] & 0xff)

    // pad code to the desired length
    code = new Array(digits + 1).join('0') + code.toString(10)

    // return the code with the desired length
    return String(code).substring(-digits)
  }
}
