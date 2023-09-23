import wrap from 'word-wrap';

import { Descriptor } from '../descriptor';
import { Style } from '../style';

export default function structures(descriptor: Descriptor, style: Style): string {
  const managerStruct = style.struct(`${descriptor.name} manager`);
  const indexStruct = style.struct(`${descriptor.name} index`);

  const managerCreateFunc = style.function(`${descriptor.name} manager create`);
  const managerDestroyFunc = style.function(`${descriptor.name} manager destroy`);

  return [
    '/**',
    wrap(`${descriptor.name} Index. This is used to track instances.`, { indent: ' * ', width: 76 }),
    ` */`,
    'typedef struct',
    '{',
    `${style.indent}size_t* idx;`,
    `${style.indent}size_t _capacity;`,
    `${style.indent}size_t _count;`,
    `} ${indexStruct};`,
    '',
    '/**',
    wrap(
      `${descriptor.name} Manager. This structure contains all the data of every ${descriptor.name} instances in a structure-of-array form.`,
      { indent: ' * ', width: 76 - (style.indent ? style.indent.length : 0) }
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
        return `${style.indent}${soaField.type}* ${soaField.name};`;
      })
      .join('\n'),
    '',
    `${style.indent}size_t _capacity;`,
    `${style.indent}size_t _count;`,
    `${style.indent}${indexStruct} _instances;`,
    `${style.indent}${indexStruct} _available;`,
    `} ${managerStruct};`,
    '',
    '/**',
    ` * ${descriptor.name} instance.`,
    ` * Instanticate using ${style.function(`${descriptor.name} create`)}()`,
    ` * Destroy using ${style.function(`${descriptor.name} Destroy`)}()`,
    ' */',
    'typedef struct {',
    `${style.indent}${managerStruct} *mgr;`,
    `${style.indent}size_t idx;`,
    `} ${descriptor.name}_t;`
  ].join('\n');
}
