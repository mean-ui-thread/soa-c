import { existsSync, mkdirSync, writeFileSync } from 'fs';

import chalk from 'chalk';

import { Descriptor, NamingConvention, SOAField } from './descriptor';
import { FormatterFunction } from './types';
import { Style } from './style';
import { StringUtils } from './stringUtils';
import soaHeader from './templates/soaHeader';

function getFormatter(namingConvention: NamingConvention): FormatterFunction {
  switch (namingConvention) {
    case NamingConvention.CamelCase:
      return StringUtils.toCamelCase;
    case NamingConvention.PascalCase:
      return StringUtils.toPascalCase;
    case NamingConvention.ScreamingSnakeCase:
      return StringUtils.toScreamingSnakeCase;
    case NamingConvention.SnakeCase:
      return StringUtils.toSnakeCase;
  }
}

export function soa_c(descriptor: Descriptor) {
  if (descriptor.outputPath && !existsSync(descriptor.outputPath)) {
    mkdirSync(descriptor.outputPath);
  }

  // Setting the defaults since quicktype doesn't seem to be doing that work for us.
  // These default values are manually synchronized from the docs/schema/descriptor.json
  // schema file.
  if (!descriptor.style) descriptor.style = {};
  if (!descriptor.style?.indent) descriptor.style.indent = '    ';
  if (!descriptor.style?.constant) descriptor.style.constant = NamingConvention.ScreamingSnakeCase;
  if (!descriptor.style?.function) descriptor.style.function = NamingConvention.CamelCase;
  if (!descriptor.style?.global) descriptor.style.global = NamingConvention.CamelCase;
  if (!descriptor.style?.macroDefinition) descriptor.style.macroDefinition = NamingConvention.ScreamingSnakeCase;
  if (!descriptor.style?.macroFunction) descriptor.style.macroFunction = NamingConvention.ScreamingSnakeCase;
  if (!descriptor.style?.struct) descriptor.style.struct = NamingConvention.PascalCase;
  descriptor.headerIncludes?.forEach((headerInclude) => {
    if (!headerInclude.isLocal) {
      headerInclude.isLocal = false;
    }
  });
  descriptor.sourceIncludes?.forEach((sourceInclude) => {
    if (!sourceInclude.isLocal) {
      sourceInclude.isLocal = false;
    }
  });
  descriptor.soaFields.forEach((field: SOAField) => {
    if (!field.generateGetter) field.generateGetter = true;
    if (!field.generateSetter) field.generateSetter = true;
  });

  const style: Style = {
    constant: getFormatter(descriptor.style.constant),
    function: getFormatter(descriptor.style.function),
    global: getFormatter(descriptor.style.global),
    indent: descriptor.style.indent,
    macroDefinition: getFormatter(descriptor.style.macroDefinition),
    macroFunction: getFormatter(descriptor.style.macroFunction),
    struct: getFormatter(descriptor.style.struct)
  };

  // make sure that our identifiers are valid
  descriptor.name = StringUtils.toCIdentifier(descriptor.name);
  descriptor.soaFields.forEach((field: SOAField) => (field.name = StringUtils.toCIdentifier(field.name)));

  const headerFileContent = soaHeader(descriptor, style);
  if (descriptor.outputPath) {
    writeFileSync(descriptor.outputPath, headerFileContent);
    console.log(chalk.bold.green(`✔ Successfully generated ${descriptor.outputPath}`));
  } else {
    console.log(headerFileContent);
  }
}
