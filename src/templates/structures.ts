import wrap from 'word-wrap';

import { Descriptor } from '../descriptor';
import { Formatter } from '../types';

export default function structures(descriptor: Descriptor, formatter: Formatter): string {
  const managerStruct = `${formatter(`${descriptor.name} manager`)}_t`;
  const indexStruct = `${formatter(`${descriptor.name} index`)}_t`;

  const managerCreateFunc = formatter(`${descriptor.name} manager create`);
  const managerDestroyFunc = formatter(`${descriptor.name} manager destroy`);

  return [
    '/**',
    wrap(`${descriptor.name} Index. This is used to track instances.`, { indent: ' * ', width: 76 }),
    ` */`,
    'typedef struct',
    '{',
    `${descriptor.indent}size_t* idx;`,
    `${descriptor.indent}size_t _capacity;`,
    `${descriptor.indent}size_t _count;`,
    `} ${indexStruct};`,
    '',
    '/**',
    wrap(
      `${descriptor.name} Manager. This structure contains all the data of every ${descriptor.name} instances in a structure-of-array form.`,
      { indent: ' * ', width: 76 - (descriptor.indent ? descriptor.indent.length : 0) }
    ),
    ` * ${descriptor.name} Manager`,
    ` * @sa ${managerCreateFunc}`,
    ` * @sa ${managerDestroyFunc}`,
    ` */`,
    'typedef struct',
    '{',
    descriptor.soaFields
      .sort()
      .map((soaField) => {
        return `${descriptor.indent}${soaField.type}* ${soaField.name};`;
      })
      .join('\n'),
    '',
    `${descriptor.indent}size_t _capacity;`,
    `${descriptor.indent}size_t _count;`,
    `${descriptor.indent}${indexStruct} _instances;`,
    `${descriptor.indent}${indexStruct} _available;`,
    `} ${managerStruct};`,
    '',
    '/**',
    ` * ${descriptor.name} instance.`,
    ` * Instanticate using ${formatter(`${descriptor.name} create`)}()`,
    ` * Destroy using ${formatter(`${descriptor.name} Destroy`)}()`,
    ' */',
    'typedef struct {',
    `${descriptor.indent}${managerStruct} *mgr;`,
    `${descriptor.indent}size_t idx;`,
    `} ${descriptor.name}_t;`
  ].join('\n');
}
