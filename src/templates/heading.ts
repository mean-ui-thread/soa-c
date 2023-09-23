import figlet from 'figlet';
import wrap from 'word-wrap';

import { Descriptor } from '../descriptor';
import { Constants } from '../constants';
import { Style } from '../style';

export default function heading(descriptor: Descriptor, style: Style): string {
  const macroPrefix = style.macroDefinition(descriptor.name);

  return [
    '/******************************************************************************',
    wrap(`This header file was code-generated on ${new Date().toUTCString()}, using:`, { indent: ' * ', width: 76 }),
    ' *',
    wrap(`${figlet.textSync(Constants.NAME, 'ANSI Shadow').trim()} v${Constants.VERSION}`, {
      indent: ' * ',
      width: 76
    }),
    wrap(Constants.DESCRIPTION, { indent: ' * ', width: 76 }),
    ' *',
    ` * By: ${Constants.AUTHOR} - Copyright (c) ${Constants.RELEASED_YEAR} - All rights reserved`,
    ` * ${Constants.HOMEPAGE}`,
    ' *',
    ' * ----------------------------------------------------------------------------',
    ' *',
    wrap(`${descriptor.name} - ${descriptor.description}`, { indent: ' * ', width: 76 }),
    descriptor.author ? [' *', ` * Author: ${descriptor.author}`, ' *'].join('\n') : ` *`,
    wrap('Before including this single-file header in *one* C or C++ file to create, do the following:', {
      indent: ' * ',
      width: 76
    }),
    ` *   #define ${macroPrefix}_IMPLEMENTATION`,
    ' *',
    ' * For example, it should look like this:',
    ' *   #include ...',
    ' *   #include ...',
    ` *   #define ${macroPrefix}_IMPLEMENTATION`,
    ` *   #include "${descriptor.name}.h"`,
    ' *',
    ' * Optionally, you can:',
    wrap(`- #define ${macroPrefix}_ASSERT(x) before the #include to override the default.`, {
      indent: ' *   ',
      width: 73
    }),
    wrap(`- #define ${macroPrefix}_MALLOC(x) before the #include to override the default.`, {
      indent: ' *   ',
      width: 73
    }),
    wrap(`- #define ${macroPrefix}_REALLOC(x) before the #include to override the default.`, {
      indent: ' *   ',
      width: 73
    }),
    wrap(`- #define ${macroPrefix}_FREE(x) before the #include to override the default.`, {
      indent: ' *   ',
      width: 73
    }),
    ' *****************************************************************************/'
  ].join('\n');
}
