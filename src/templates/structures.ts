import wrap from 'word-wrap';

import { Style } from '../style';

export default function structures(style: Style): string {
  const opts = { indent: ' * ', width: 76 };

  return [
    '/**',
    wrap(`${style.soaStruct} Index Structure. This is used to track instances.`, opts),
    ` */`,
    'typedef struct',
    '{',
    `${style.tab(' ')}size_t* idx;`,
    `${style.tab(' ')}size_t _capacity;`,
    `${style.tab(' ')}size_t _count;`,
    `} ${style.soaIndexStruct};`,
    '',
    '/**',
    wrap(
      `${style.soaStruct} Manager Structure. This structure contains all the data of every ${style.soaStruct} instances in a structure-of-array form.`,
      opts
    ),
    ` * ${style.soaStruct} Manager`,
    ` * @sa ${style.soaCreateFunc}`,
    ` * @sa ${style.soaDestroyFunc}`,
    ` * @sa ${style.soaManagerCreateFunc}`,
    ` * @sa ${style.soaManagerDestroyFunc}`,
    ` */`,
    'typedef struct',
    '{',
    style.soaFields
      .map((soaField) => {
        return `${style.tab(' ')}${soaField.type}* ${soaField.name};`;
      })
      .join('\n'),
    '',
    `${style.tab(' ')}size_t _capacity;`,
    `${style.tab(' ')}size_t _count;`,
    `${style.tab(' ')}${style.soaIndexStruct} _instances;`,
    `${style.tab(' ')}${style.soaIndexStruct} _available;`,
    `} ${style.soaManagerStruct};`,
    '',
    '/**',
    ` * ${style.soaStruct} instance.`,
    ` * Instantiate using ${style.soaCreateFunc}`,
    ` * Destroy using ${style.soaCreateFunc}`,
    ' */',
    'typedef struct {',
    `${style.tab(' ')}${style.soaManagerStruct} *mgr;`,
    `${style.tab(' ')}size_t idx;`,
    `} ${style.soaStruct};`
  ].join('\n');
}
