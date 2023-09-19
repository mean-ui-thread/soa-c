import { existsSync, mkdirSync, writeFileSync } from 'fs';

import chalk from 'chalk';
import _ from 'lodash';

import { Descriptor, EStyle, SOAField } from './descriptor';
import { Formatter } from './types';
import makeCIdentifier from './utils/makeCIdentifier';
import soaHeader from './templates/soaHeader';

export function soa_c(descriptor: Descriptor) {
  if (!existsSync(descriptor.outputPath)) {
    mkdirSync(descriptor.outputPath);
  }

  // Setting the defaults since quicktype doesn't seem to be doing that work for us
  if (!descriptor.style) descriptor.style = EStyle.CamelCase;
  if (!descriptor.indent) descriptor.indent = '    ';

  let formatter: Formatter;

  switch (descriptor.style) {
    case EStyle.CamelCase: {
      descriptor.name = _.camelCase(makeCIdentifier(descriptor.name));
      descriptor.soaFields.forEach((field: SOAField) => (field.name = _.camelCase(makeCIdentifier(field.name))));
      formatter = _.camelCase;
      break;
    }
    case EStyle.SnakeCase: {
      descriptor.name = _.snakeCase(makeCIdentifier(descriptor.name));
      descriptor.soaFields.forEach((field: SOAField) => (field.name = _.snakeCase(makeCIdentifier(field.name))));
      formatter = _.snakeCase;
      break;
    }
  }

  const headerFileContent = soaHeader(descriptor, formatter);
  const headerFilePath = `${descriptor.outputPath}/${descriptor.name}.h`;
  writeFileSync(headerFilePath, headerFileContent);
  console.log(chalk.bold.green(`✔ Successfully generated ${headerFilePath}`));
}
