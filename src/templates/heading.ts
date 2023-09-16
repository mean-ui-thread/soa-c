import figlet from 'figlet';
import wrap from 'word-wrap';

import details from '../details.json';
import { Descriptor } from '../descriptor';

export default function heading(descriptor: Descriptor): string {
  return [
    '/******************************************************************************',
    wrap(`${descriptor.name} - ${descriptor.description}`, { indent: ' * ', width: 77 }),
    descriptor.author ? [' *', ` * Author: ${descriptor.author}`, ' *'].join('\n') : ` *`,
    ' * ----------------------------------------------------------------------------',
    ' *',
    wrap(`This header file was code-generated on ${new Date().toUTCString()}, using:`, { indent: ' * ', width: 77 }),
    ' *',
    wrap(`${figlet.textSync(details.name, 'ANSI Shadow').trim()} v${details.version}`, { indent: ' * ', width: 77 }),
    wrap(details.description, { indent: ' * ', width: 77 }),
    ' *',
    ` * By: ${details.author} - Copyright (c) ${new Date().getFullYear()} - All rights reserved`,
    ` * ${details.homepage}`,
    ' *',
    ' *****************************************************************************/'
  ].join('\n');
}
