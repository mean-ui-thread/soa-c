import _ from 'lodash';

import { Descriptor } from '../descriptor';
import { Formatter } from '../types';

import definitions from './definitions';
import heading from './heading';
import { headerIncludes, sourceIncludes } from './includes';
import { functionPrototypes, functionDefinitions } from './functions';
import structures from './structures';

export default function soaHeader(descriptor: Descriptor, formatter: Formatter): string {
  const macroPrefix = _.toUpper(_.snakeCase(descriptor.name));

  return [
    heading(descriptor),
    `#ifndef ${macroPrefix}_H`,
    `#define ${macroPrefix}_H`,
    '',
    headerIncludes(descriptor),
    '',
    '#ifdef __cplusplus',
    'extern "C" {',
    '#endif',
    '',
    structures(descriptor, formatter),
    '',
    functionPrototypes(descriptor, formatter),
    '',
    '#ifdef __cplusplus',
    '}',
    '#endif',
    '',
    `#endif /* ${macroPrefix}_H */`,
    '',
    `#ifdef ${macroPrefix}_IMPLEMENTATION`,
    '',
    sourceIncludes(descriptor),
    '',
    definitions(descriptor),
    '',
    '#ifdef __cplusplus',
    'extern "C" {',
    '#endif',
    '',
    functionDefinitions(descriptor, formatter),
    '',
    '#ifdef __cplusplus',
    '}',
    '#endif',
    '',
    `#endif /* ${macroPrefix}_IMPLEMENTATION */`,
    ''
  ].join('\n');
}
