Test Cases

 First Name / Last Name (alphanumeric, max 20)
- ✅ Valid: Maria, Joao123
- ❌ Invalid: Ana! (symbol), Jose (accent), string with more than 20 characters

 Email (valid format)
- ✅ Valid: a@b.com, name.surname@domain.ie
- ❌ Invalid: name@domain (missing TLD), @nouser.com (missing user)

 Phone Number (exactly 10 digits)
- ✅ Valid: 0123456789
- ❌ Invalid: 123456789 (9), 12345678901 (11), 12345-6789 (hyphen), abcdefghij (letters)

 Eircode (6 characters, starts with a number, alphanumeric)
- ✅ Valid: 1AB2C3, 9X9X9X
- ❌ Invalid: A123BC (does not start with a number), 12345 (5), 1234567 (7), 12 3ABC (space), 1234!A (symbol)

 Server (port/errors)
- When the port is already in use or closed → the app must return a clear error message.

 Database (insert only if valid)
- Invalid payload → do not insert.
- Valid payload → insert into user_data(first_name, last_name, email, phone_number, eircode).
