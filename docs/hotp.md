# HMAC-based One-Time Password (HOTP)

## generate()

The `generate` method in the `Hotp` class generates a one-time password using the HOTP algorithm. It takes in an `options` object with various configuration settings, computes the digest of the provided data, calculates the HOTP offset, and constructs the OTP by combining specific bytes from the digest. The method then pads the OTP with leading zeros and returns the final OTP as a string.

The method takes in an `options` object as a parameter, which contains various configuration settings for generating the OTP. These settings include the `counter`, `secret`, `algorithm`, and `encoding`. The options object is of type `HotpOptions`.

Inside the method, the first line declares a constant variable `digits`, which represents the number of digits the OTP should have. If the digits property is not provided in the `options` object, it defaults to `6`.

The next line calls a function named `digest()` and passes an object containing the `counter`, `secret`, `algorithm`, and `encoding` properties from the `options` object. This function is responsible for computing the digest of the provided data using the specified algorithm and encoding.

After computing the digest, the code calculates the HOTP offset, which is the last 4 bits of the digest. It does this by taking the last element of the `digestedOptions` array and applying a bitwise AND operation with 0xf (which is equivalent to 15 in decimal).

The subsequent lines of code calculate the binary code for the OTP. It combines specific bytes from the `digestedOptions` array based on the calculated offset. The binary code is constructed by shifting the bytes to their appropriate positions and performing bitwise OR operations.

Next, the code converts the binary code to a string representation by using the `toString()` method with a base of `10`. It also pads the string with leading zeros to match the desired number of digits specified by the `digits` variable.

Finally, the code returns a substring of the padded code, starting from the negative value of `digits`. This effectively removes any leading zeros and ensures that the OTP has the correct number of digits.

## verifyDelta()

## verify()
