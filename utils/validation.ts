export function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function validatePassword(password: string) {
  return password.length >= 6;
}
