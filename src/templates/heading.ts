import figlet from 'figlet';
import wrap from 'word-wrap';

import { Descriptor } from '../descriptor';
import { Constants } from '../constants';

export default function heading(descriptor: Descriptor): string {
  return [
    '/******************************************************************************',
    wrap(`${descriptor.name} - ${descriptor.description}`, { indent: ' * ', width: 77 }),
    descriptor.author ? [' *', ` * Author: ${descriptor.author}`, ' *'].join('\n') : ` *`,
    ' * ----------------------------------------------------------------------------',
    ' *',
    wrap(`This header file was code-generated on ${new Date().toUTCString()}, using:`, { indent: ' * ', width: 77 }),
    ' *',
    wrap(`${figlet.textSync(Constants.NAME, 'ANSI Shadow').trim()} v${Constants.VERSION}`, {
      indent: ' * ',
      width: 77
    }),
    wrap(Constants.DESCRIPTION, { indent: ' * ', width: 77 }),
    ' *',
    ` * By: ${Constants.AUTHOR} - Copyright (c) ${Constants.RELEASED_YEAR} - All rights reserved`,
    ` * ${Constants.HOMEPAGE}`,
    ' *',
    ' *****************************************************************************/'
  ].join('\n');
}
