# Helpers

## Secrets

### generateASCII()

The `generateASCII` method generates a random ASCII string of a specified length, with an optional inclusion of symbols. It uses the `crypto.randomBytes` function to generate random bytes, and then maps those bytes to characters from a set of alphanumeric characters (and symbols, if specified). The resulting ASCII string is returned by the method.

The method takes two parameters: `length` and `symbols`.

- `length`: specifies the length of the ASCII string to be generated.
- `symbols`: determines whether symbols should be included in the generated string.

Inside the method, the `crypto.randomBytes` function is used to generate a random sequence of bytes. The `length` parameter is passed to this function to determine the number of bytes to generate. If the `length` parameter is not provided, a default value of 32 is used.

Next, a string variable named `set` is initialized with a default set of characters consisting of alphanumeric characters. This set will be used to generate the ASCII string. If the `symbols` parameter is truthy (i.e., not empty or false), additional symbols such as `!@#$%^&*()<>?/[]{},.:;` are appended to the `set` string.

A variable named `output` is initialized as an empty string. This variable will store the generated ASCII string.

The code then enters a loop that iterates over each byte in the `bytes` array. For each byte, the code calculates an index into the `set` string by dividing the byte value by 255 and multiplying it by the length of the `set` string minus 1. This index is used to retrieve a character from the `set` string, which is then appended to the `output` string.

Finally, the output string, which now contains the generated ASCII string, is returned from the method.

### generateSecret()

The `generateSecret` method generates a secret key based on the provided options. It allows customization of the key's length, inclusion of symbols, and generation of an OTP (One-Time Password) authentication URL if desired. The generated secret key is returned as an object with ASCII, hexadecimal, and base32 representations.

The method takes an `options` object as its parameter and extracts its properties. It assigns the `label`, `issuer`, `length`, `otpAuthUrl`, and `symbols` properties to separate variables using destructuring assignment.

- `label`: specifies the label for the OTP authentication URL.
- `issuer`: specifies the issuer name for the OTP authentication URL.
- `length`: specifies the length of the secret key to be generated. The property has a default value of 32.
- `symbols`: determines whether symbols should be included in the generated key. The property has a default value of `true`.
- `otpAuthUrl`: determines whether an OTP authentication URL should be generated. The property has a default value of `false`.

The method then generates an ASCII string using the `generateASCII()` method with the specified `length` and `symbols` properties.

After that, the code creates a `secretKey` object of type `SecretKey` and assigns the `ascii`, `hex`, and `base32` properties to the corresponding values.

- The `ascii` property is set to the generated secret key.
- The `hex` property is obtained by converting the `secret` from ASCII to hexadecimal using the `Buffer.from()` method.
- The `base32` property is obtained by encoding the secret using the `Base32.encode()` method and removing any trailing equal signs.

If the `otpAuthUrl` property is true, the code adds an additional property to the `secretKey` object. This property is an object itself with `secret`, `label`, and `issuer` properties.

- The `secret` property is set to the `ascii` value of the secret key.
- The `label` property is set to the name value from the `options` object
- The `issuer` property is set to the `issuer` value from the `options` object.

## OTP Auth URL

### otpAuthUrl()

The `otpAuthUrl` method takes in an options object, validates the properties, encodes the secret if necessary, and generates an OTP authentication URL based on the provided options.

- The `secret` variable is initialized with the value of `options.secret`.
- The `type` property defaults to `totp` if not provided.
- The `period` property defaults to `30` if not provided.
- The `digits` property defaults to `6` if not provided.
- The `algorithm` property defaults to `SHA1` if not provided.

The method then validates the properties `type`, `period`, `digits`, and `algorithm` to ensure they are valid values. If any of the properties are invalid, an error is thrown.

If the `type` is `'hotp'`, the code checks if the `counter` property is missing in the `options` object, and throws an error if it is not provided.

Next, the code encodes the `secret` to base32 if the `encoding` property in the options object is not `'base32'`. It uses the `Buffer.from()` method to convert the `secret` to a buffer, and then encodes it using the `Base32.encode()` method. The resulting encoded secret is assigned back to the `secret` variable.

After that, a `query` object is created with properties `issuer`, `algorithm`, `digits`, `period`, and `secret`, which are populated with the corresponding variables.

Finally, the function uses the `url.format()` method to generate the OTP authentication URL.

It constructs the URL with:

- `protocol` set to `'otpauth'`.
- `slashes` set to `true`
- `hostname` set to the `type` value
- `pathname` set to the URL-encoded `options.label`
- `query` set to the `query` object.

## Counter

### counter()

The `counter` method calculates a `counter` value based on the provided options. The function takes a parameter `options` of type `CounterOptions` and returns a number.

The method extracts the `step`, `time`and `epoch` properties from the `options`.

- `step`: Time in seconds. Defaults to `30`.
- `time`: Time in seconds with which to calculate counter value. Defaults to `Date.now()`.
- `epoch`: Initial time since the UNIX epoch from which to calculate the counter value. Defaults to `0` (no offset).

The return statement of the function calculates the counter value by subtracting the `epoch` value from the `time` value, dividing the result by the `step` value, and then dividing it again by `1000`. The `Math.floor()` function is used to round down the result to the nearest integer. The final result is the calculated counter value.

## Digest

### digest()

The `digest` function takes in options for `encoding`, `algorithm`, `secret`, and `counter`. It converts the secret to a buffer, adjusts its size if necessary, creates a buffer from the counter, initializes an HMAC object with the secret and algorithm, updates the HMAC with the counter buffer, and returns the resulting digest as a buffer.

The function begins by extracting the `encoding` and `algorithm` properties from the `options` object. If these properties are not provided, default values of `'ascii'` for `encoding` and `'SHA1'` for `algorithm` are used. The function also initializes variables secret and secretBufferSize to store the secret and its size, respectively.

Next, the function checks if the `secret` is already a `Buffer`. If not, it converts the `secret` to a `Buffer` based on the specified encoding. If the encoding is `'base32'`, it decodes the secret using the `Base32.decode()` method and converts it to a string. Then, it creates a Buffer from the string representation of the secret using the specified encoding.

The function then sets the `secretBufferSize` based on the algorithm specified. It assigns different values to `secretBufferSize` depending on the algorithm: 20 for `'SHA1'`, 32 for `'SHA256'`, and 64 for `'SHA512'`.

After that, the function checks if the `secret` buffer has the expected size (`secretBufferSize`). If the sizes do not match, it adjusts the size of the `secret` buffer. It does this by repeating the secret string in hexadecimal format until it reaches or exceeds the desired size, and then truncating it to the desired size.

The function proceeds to create a new `Buffer` named `buffer` with a length of `8 bytes`. It then initializes a `counter` variable with the value of `options.counter`. The function uses a loop to fill the `buffer` with the individual bytes of the `counter` value. It masks the last 8 bits of the `counter` using `0xff` and assigns the result to the corresponding index in the `buffer`. It then shifts the `counter` 8 bits to the right to prepare for the next iteration.

Next, the function initializes an HMAC (Hash-based Message Authentication Code) object named `hmac` using the `crypto.createHmac()` method. It passes the `algorithm` and `secret` as arguments to the `createHmac` method.

The function updates the `hmac` object with the `buffer` using the `hmac.update()` method. This incorporates the `buffer` into the HMAC calculation.

Finally, the function returns the `digest` of the HMAC calculation using the `hmac.digest()` method. The digest is returned as a `Buffer`.
