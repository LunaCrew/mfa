export type SecretKey = {
  ascii: string
  base32: string
  hex: string
  otpAuthUrl?: {
    secret: string
    issuer: string
    label: string
  }
}
