export type SecretOptions = {
  label: string
  issuer: string
  length?: number
  otpAuthUrl?: boolean
  symbols?: boolean
}

export type OtpAuthOptions = {
  label: string
  issuer: string
  secret: string
  counter?: number
  type?: 'topt' | 'hotp'
  period?: number
  digits?: 6 | 8
  algorithm?: 'SHA1' | 'SHA256' | 'SHA512'
  encoding?: 'ascii' | 'hex' | 'base32'
}

export type CounterOptions = {
  step?: number
  time?: number
  epoch?: number
}

export type DigestOptions = {
  secret: string
  counter: number
  algorithm?: 'SHA1' | 'SHA256' | 'SHA512'
  encoding?: 'ascii' | 'hex' | 'base32'
}

export type HotpOptions = {
  secret: string
  token: string
  counter: number
  digits?: 6 | 8
  window?: number
  algorithm?: 'SHA1' | 'SHA256' | 'SHA512'
  encoding?: 'ascii' | 'hex' | 'base32'
}
