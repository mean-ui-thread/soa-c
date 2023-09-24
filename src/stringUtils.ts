import _ from 'lodash';

/**
 * Camel case capitalizes the first letter of every words except the first
 * letter of the word, which will be lower cased. Every word delimiters such
 * as spaces, dashes or underscores will be removed.
 * @param words The word inputs to convert to camel case.
 * @returns The camel case variant of the words.
 */
function toCamelCase(words: string[]): string {
  return _.camelCase(words.join(' '));
}

/**
 * Pascal case capitalizes the first letter of every words. Every word
 * delimiters such as spaces, dashes or underscores will be removed.
 * @param words The word inputs to convert to pascal case.
 * @returns The pascal case string.
 */
function toPascalCase(words: string[]): string {
  return _.upperFirst(_.camelCase(words.join(' ')));
}

/**
 * Screaming snake case capitalizes ever letter of every words. Every words
 * will be delimited by an underscore.
 * @param words The word inputs to convert to screaming snake case.
 * @returns  The screaming snake case string.
 */
function toScreamingSnakeCase(words: string[]): string {
  return _.toUpper(_.snakeCase(words.join(' ')));
}

/**
 * Snake case lower case every letter of every words. Every words will be
 * delimited by an underscore.
 * @param words The word inputs to convert to snake case.
 * @returns The snake case string.
 */
function toSnakeCase(words: string[]): string {
  return _.snakeCase(words.join(' '));
}

/**
 * Converts a string into a C/C++ compliant identifier. A C/C++ identifier
 * must start with an alphabetic character, followed by any alphanumeric and
 * underscore. Every non-compliant characters will be turned into an
 * underscore character.
 * @param string The string input to convert to a C/C++ compliant identifier.
 * @returns The C/C++ compliant identifier string.
 */
function toCIdentifier(string: string): string {
  // replace any characters that are not in the a-z or A-Z or 0-9 range to an
  // underscore
  const result = string.replace(/[^\w]/g, '_');

  // if the first character is not in the a-z or A-Z range, or an underscore,
  // add a prefix underscore
  if (!result.charAt(0).match(/[a-zA-Z_]/)) {
    return '_' + result;
  }

  return result;
}

export const StringUtils = {
  toCamelCase,
  toPascalCase,
  toScreamingSnakeCase,
  toSnakeCase,
  toCIdentifier
};
