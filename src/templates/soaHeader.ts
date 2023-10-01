import { Style } from '../style';

import { headerDefinitions, sourceDefinitions } from './definitions';
import heading from './heading';
import { headerIncludes, sourceIncludes } from './includes';
import { functionPrototypes, functionDefinitions } from './functions';
import structures from './structures';

export default function soaHeader(style: Style): string {
  return [
    heading(style),
    `#ifndef ${style.macroHeaderGuardDef}`,
    `#define ${style.macroHeaderGuardDef}`,
    '',
    headerIncludes(style),
    '',
    headerDefinitions(style),
    '',
    '#ifdef __cplusplus',
    'extern "C" {',
    '#endif',
    '',
    structures(style),
    '',
    functionPrototypes(style),
    '',
    '#ifdef __cplusplus',
    '}',
    '#endif',
    '',
    `#endif /* ${style.macroHeaderGuardDef} */`,
    '',
    `#ifdef ${style.macroImplGuardDef}`,
    '',
    sourceIncludes(style),
    '',
    sourceDefinitions(style),
    '',
    '#ifdef __cplusplus',
    'extern "C" {',
    '#endif',
    '',
    functionDefinitions(style),
    '',
    '#ifdef __cplusplus',
    '}',
    '#endif',
    '',
    `#endif /* ${style.macroImplGuardDef} */`,
    ''
  ].join('\n');
}
