import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import wrap from 'word-wrap';
import _ from 'lodash';
import figlet from 'figlet';
import details from './details.json';
import makeCIdentifier from './makeCIdentifier';

import { Descriptor, EStyle, ISOAField } from './descriptor';
import chalk from 'chalk';

export function soa_c(descriptor: Descriptor) {
  if (!existsSync(descriptor.outputPath)) {
    mkdirSync(descriptor.outputPath);
  }

  // Setting the defaults since quicktype doesn't seem to be doing that work for us
  if (descriptor.style === undefined) descriptor.style = EStyle.CamelCase;
  if (descriptor.indent === undefined) descriptor.indent = '    ';

  type Formatter = (str: string | undefined) => string;

  let formatter: Formatter;

  switch (descriptor.style) {
    case EStyle.CamelCase: {
      descriptor.name = _.camelCase(makeCIdentifier(descriptor.name));
      descriptor.soaFields.forEach((field: ISOAField) => (field.name = _.camelCase(makeCIdentifier(field.name))));
      formatter = _.camelCase;
      break;
    }
    case EStyle.SnakeCase: {
      descriptor.name = _.snakeCase(makeCIdentifier(descriptor.name));
      descriptor.soaFields.forEach((field: ISOAField) => (field.name = _.snakeCase(makeCIdentifier(field.name))));
      formatter = _.snakeCase;
      break;
    }
  }

  const params = {
    descriptor: descriptor,
    details: details,
    formatter,
    figlet,
    wrap,
    _
  };

  const headingTemplate = _.template(readFileSync(__dirname + '/templates/soa.heading.template').toString());
  const headerTemplate = _.template(readFileSync(__dirname + '/templates/soa.h.template').toString());
  const sourceTemplate = _.template(readFileSync(__dirname + '/templates/soa.c.template').toString());

  const headingContent = headingTemplate(params);

  const headerFileContent = headingContent + headerTemplate(params);
  const sourceFileContent = headingContent + sourceTemplate(params);

  const headerFilePath = `${descriptor.outputPath}/${descriptor.name}.h`;
  const sourceFilePath = `${descriptor.outputPath}/${descriptor.name}.c`;

  writeFileSync(headerFilePath, headerFileContent);
  writeFileSync(sourceFilePath, sourceFileContent);

  console.log(chalk.bold.green(`✔ Successfully generated ${headerFilePath}`));
  console.log(chalk.bold.green(`✔ Successfully generated ${sourceFilePath}`));
}
