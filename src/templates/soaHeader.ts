import _ from 'lodash';
import wrap from 'word-wrap';

import { Descriptor } from '../descriptor';
import { Formatter } from '../types';
import heading from './heading';

export default function soaHeader(descriptor: Descriptor, formatter: Formatter): string {
  const headerGuard = `${_.toUpper(_.snakeCase(descriptor.name))}_H`;

  return [
    heading(descriptor),
    `#ifndef ${headerGuard}`,
    `#define ${headerGuard}`,
    '',
    '#include <stddef.h> /* size_t */',
    descriptor.headerIncludes
      ? descriptor.headerIncludes
          .map((include) => {
            const comment = include.comment ? ' /* ' + include.comment + ' */' : '';
            if (include.isLocal) {
              return `#include "${include.fileName}"${comment}`;
            } else {
              return `#include <${include.fileName}>${comment}`;
            }
          })
          .join('\n')
      : '',
    '',
    '#ifdef __cplusplus',
    'extern "C" {',
    '#endif',
    '',
    `/* opaque instance for ${descriptor.name} */`,
    `typedef struct { size_t id; } ${descriptor.name}_t;`,
    '',
    '/**',
    ` * ${descriptor.name} Initializer`,
    wrap(
      'This function should be called once before creating instances. It creates the SOA management structure instance behind the scene.',
      { indent: ' * ', width: 77 }
    ),
    ` * @sa ${formatter(`${descriptor.name} shutdown`)}`,
    ` * @sa ${formatter(`${descriptor.name} create`)}`,
    ' */',
    `void ${formatter(`${descriptor.name} init`)}();`,
    '',
    '/**',
    ` * ${descriptor.name} Shutdown`,
    wrap(
      'This function should be called once before shutting down the application to avoid a memory leak. It destroys the SOA management structure instance behind the scene.',
      { indent: ' * ', width: 77 }
    ),
    ` * @sa ${formatter(`${descriptor.name} init`)}`,
    ' */',
    `void ${formatter(`${descriptor.name} shutdown`)}();`,
    '',
    '/**',
    ` * ${descriptor.name} Instance Allocator.`,
    wrap(`This function instantiates a new ${descriptor.name} instance`, { indent: ' * ', width: 77 }),
    wrap(`@warning Make sure that ${formatter(`${descriptor.name} init`)} was called before calling this function`, {
      indent: ' * ',
      width: 77
    }),
    ` * @sa ${formatter(`${descriptor.name} init`)}`,
    ` * @sa ${formatter(`${descriptor.name} destroy`)}`,
    ' */',
    `${descriptor.name}_t ${formatter(`${descriptor.name} create`)}();`,
    '',
    '/**',
    ` * ${descriptor.name} Instance Deallocator.`,
    wrap(`This function destroys a ${descriptor.name} instance`, { indent: ' * ', width: 77 }),
    ` * @sa ${formatter(`${descriptor.name} create`)}`,
    ' */',
    `void ${formatter(`${descriptor.name} destroy`)}(${descriptor.name}_t instance);`,
    '',
    descriptor.soaFields
      .sort()
      .map((soaField) => {
        const soaGetterName = formatter(`${descriptor.name} get ${soaField.name}`);
        const soaSetterName = formatter(`${descriptor.name} set ${soaField.name}`);
        return (
          `/**\n` +
          ` * Getter for ${soaField.name}\n` +
          (soaField.comment ? ` * ${soaField.comment}\n` : '') +
          ` * @param instance the ${descriptor.name} instance\n` +
          ` * @return The value of ${soaField.name}\n` +
          ` * @sa ${soaSetterName}\n` +
          ` */\n` +
          `${soaField.type} ${soaGetterName}(${descriptor.name}_t instance);\n` +
          '\n' +
          `/**\n` +
          ` * Setter for ${soaField.name}\n` +
          (soaField.comment ? ` * ${soaField.comment}\n` : '') +
          ` * @param instance the ${descriptor.name} instance\n` +
          ` * @param ${soaField.name} The value of ${soaField.name}\n` +
          ` * @sa ${soaGetterName}\n` +
          ` */\n` +
          `void ${soaSetterName}(${descriptor.name}_t instance, ${soaField.type} ${soaField.name});`
        );
      })
      .join('\n\n'),
    '',
    '#ifdef __cplusplus',
    '}',
    '#endif',
    '',
    `#endif /* ${headerGuard} */`,
    ''
  ].join('\n');
}
