/* eslint-disable @typescript-eslint/no-extraneous-class */
import _ from 'lodash';

export class StringUtils {
  public static toCamelCase(string: string): string {
    return _.camelCase(string);
  }

  public static toPascalCase(string: string): string {
    return _.upperFirst(_.camelCase(string));
  }

  public static toScreamingSnakeCase(string: string): string {
    return _.toUpper(_.snakeCase(string));
  }

  public static toSnakeCase(string: string): string {
    return _.snakeCase(string);
  }

  public static toCIdentifier(string: string): string {
    // replace any characters thare are not in the a-z or A-Z or 0-9 range to an underscore
    const result = string.replace(/[^\w]/g, '_');

    // if the first character is ot in the a-z or A-Z range, or an underscore, add a prefix underscore
    if (!result.charAt(0).match(/[a-zA-Z_]/)) {
      return '_' + result;
    }

    return result;
  }
}
