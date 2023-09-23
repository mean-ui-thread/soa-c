import { Descriptor } from '../descriptor';
import { Style } from '../style';

import definitions from './definitions';
import heading from './heading';
import { headerIncludes, sourceIncludes } from './includes';
import { functionPrototypes, functionDefinitions } from './functions';
import structures from './structures';

export default function soaHeader(descriptor: Descriptor, style: Style): string {
  const macroPrefix = style.macroDefinition(descriptor.name);

  return [
    heading(descriptor, style),
    `#ifndef ${macroPrefix}_H`,
    `#define ${macroPrefix}_H`,
    '',
    headerIncludes(descriptor, style),
    '',
    '#ifdef __cplusplus',
    'extern "C" {',
    '#endif',
    '',
    structures(descriptor, style),
    '',
    functionPrototypes(descriptor, style),
    '',
    '#ifdef __cplusplus',
    '}',
    '#endif',
    '',
    `#endif /* ${macroPrefix}_H */`,
    '',
    `#ifdef ${macroPrefix}_IMPLEMENTATION`,
    '',
    sourceIncludes(descriptor, style),
    '',
    definitions(descriptor, style),
    '',
    '#ifdef __cplusplus',
    'extern "C" {',
    '#endif',
    '',
    functionDefinitions(descriptor, style),
    '',
    '#ifdef __cplusplus',
    '}',
    '#endif',
    '',
    `#endif /* ${macroPrefix}_IMPLEMENTATION */`,
    ''
  ].join('\n');
}
