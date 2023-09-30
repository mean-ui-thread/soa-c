import wrap from 'word-wrap';

import { Style } from '../style';

export default function structures(style: Style): string {
  const opts = { indent: ' * ', width: 76 };

  return [
    '/**',
    ` * @brief ${style.soaStruct} Manager Structure.`,
    wrap(
      `This structure contains all the data of every ${style.soaStruct} instances in a structure-of-array form.`,
      opts
    ),
    ` * @sa ${style.soaCreateFunc}`,
    ` * @sa ${style.soaGrabFunc}`,
    ` * @sa ${style.soaDropFunc}`,
    ` * @sa ${style.soaManagerCreateFunc}`,
    ` * @sa ${style.soaManagerDestroyFunc}`,
    ` */`,
    'typedef struct',
    '{',
    style.soaFields
      .map((soaField) => {
        const comment = soaField.comment ? ` /*!< ${soaField.comment} */` : '';
        return style.tab(1, `${soaField.type}* ${soaField.name};${comment}`);
      })
      .join('\n'),
    '',
    style.tab(1, `size_t* _refCount; /*!<  Instance reference counter */`),
    style.tab(1, `size_t* _indexToInstanceMap; /*!<  index to the instance map. */`),
    style.tab(
      1,
      `size_t* _instanceToIndexMap; /*!<  instance map of the instance in the ${style.soaManagerStruct} to the index */`
    ),
    style.tab(
      1,
      `size_t _capacity; /*!<  Allocated capacity of the ${style.soaManagerStruct}. Will double in capacity when the limit has been reached. */`
    ),
    style.tab(1, `size_t _count; /*!<  amount of ${style.soaManagerStruct} in use */`),
    `} ${style.soaManagerStruct};`,
    '',
    '/**',
    ` * @brief ${style.soaStruct} instance.`,
    ` * @sa ${style.soaCreateFunc}`,
    ` * @sa ${style.soaCreateFunc}`,
    ' */',
    'typedef struct {',
    style.tab(1, `${style.soaManagerStruct} *mgr; /* pointer to the ${style.soaManagerStruct} instance */`),
    style.tab(1, 'size_t idx; /* index to the mgr->_indexToInstanceMap array */'),
    `} ${style.soaStruct};`
  ].join('\n');
}
