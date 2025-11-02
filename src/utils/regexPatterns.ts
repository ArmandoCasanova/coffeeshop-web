export const REGEX_PATTERNS = {
  INTEGER: /^(\s*|\d+)$/,
  TEN_DIGITS_PHONE: /^[0-9]{10}$/,
  LETTERS: /^[a-zñA-ZÑ\s]*$/,
  ALPHANUMERIC: /^[a-z0-9\s]*$/i,
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
  HAS_NUMBER: /\d/,
  HAS_SPECIAL_CHAR: /[@$!%*?&]/,
  HAS_UPPERCASE_AND_LOWERCASE: /(?=.*[a-z])(?=.*[A-Z])/,
  LENGTH_8_20: /^.{8,20}$/,
};
