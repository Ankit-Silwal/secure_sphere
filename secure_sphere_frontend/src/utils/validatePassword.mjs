export function validatePassword(password, email = "", username = "") {
  const errors = [];

  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`]).{8,64}$/;

  if (!strongRegex.test(password)) {
    errors.push(
      "Password must be 8–64 characters long and include uppercase, lowercase, number, and special character."
    );
  }

  const commonPasswords = [
    "123456",
    "password",
    "123456789",
    "qwerty",
    "abc123",
    "111111",
    "password1",
    "12345678",
    "admin",
    "iloveyou",
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Password is too common.");
  }

  const lower = password.toLowerCase();
  const emailPrefix = email.split("@")[0]?.toLowerCase();
  const userLower = username?.toLowerCase();

  if (emailPrefix && lower.includes(emailPrefix)) {
    errors.push("Password cannot contain parts of your email.");
  }
  if (userLower && lower.includes(userLower)) {
    errors.push("Password cannot contain your username.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
