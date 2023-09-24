import figlet from 'figlet';
import wrap from 'word-wrap';
import { getLicense } from 'license';

import { Constants } from '../constants';
import { Style } from '../style';

export default function heading(style: Style): string {
  const replacements: {
    [key: string]: string;
  } = {
    year: `${new Date().getUTCFullYear()}`
  };

  if (style.author) replacements.author = style.author;
  if (style.email) replacements.email = style.email;

  const author = style.author ? `, by ${style.author}` : '';
  const homepage = style.homepage ? ` (${style.homepage})` : '';
  const description = style.description ? ` : ${style.description}` : '';

  const licenseLines = style.license ? getLicense(style.license, replacements).split('\n') : [];

  const opts = { indent: ' * ', width: 76 };

  return [
    '/******************************************************************************',
    wrap(`DO NOT EDIT!!! This header file was code-generated on ${new Date().toUTCString()}, using:`, opts),
    ' *',
    wrap(`${figlet.textSync(Constants.NAME, 'ANSI Shadow').trim()} v${Constants.VERSION}`, opts),
    wrap(Constants.DESCRIPTION, opts),
    ' *',
    ` * By: ${Constants.AUTHOR} - Copyright (c) ${Constants.RELEASED_YEAR} - All rights reserved.`,
    ` * ${Constants.HOMEPAGE}`,
    ' *',
    ' * ----------------------------------------------------------------------------',
    ' *',
    wrap(`${style.soaStruct}${author}${homepage}${description}`, opts),
    ' *',
    wrap('Before including this single-file header in *one* C or C++ file to create, do the following:', opts),
    ` *   #define ${style.macroImplGuardDef}`,
    ' *',
    ' * For example, it should look like this:',
    ' *   #include ...',
    ' *   #include ...',
    ` *   #define ${style.macroImplGuardDef}`,
    ` *   #include "${style.soaStruct}.h"`,
    ' *',
    ' * Optionally, you can define the following before including this header:',
    ` *   #define ${style.macroAlignmentDef} ...`,
    ` *   #define ${style.macroAssertFunc}(condition) ...`,
    ` *   #define ${style.macroAlignedAllocFunc}(align, ptr) ...`,
    ` *   #define ${style.macroAlignedFreeFunc}(ptr) ...`,
    ` *   #define ${style.macroAlignedReallocFunc}(ptr, align, ptr) ...`,
    ` *   #define ${style.macroMallocUsableSizeFunc}(ptr) ...`,
    ` *   #define ${style.macroImplGuardDef}`,
    ` *   #include "${style.soaStruct}.h"`,
    ' *',
    ' *****************************************************************************/',
    '',
    style.license
      ? [
          '/******************************************************************************',
          licenseLines.map((licenseLine) => wrap(licenseLine, opts)).join('\n'),
          ' *****************************************************************************/',
          ''
        ].join('\n')
      : ''
  ].join('\n');
}
