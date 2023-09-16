export default function makeCIdentifier(identifier: string): string {
  // replace any characters thare are not in the a-z or A-Z or0-9 range to an underscore
  const result = identifier.replace(/[^\w]/g, '_');

  // if the first character is ot in the a-z or A-Z range, or an underscore, add a prefix underscore
  if (!result.charAt(0).match(/[a-zA-Z_]/)) {
    return '_' + result;
  }

  return result;
}
