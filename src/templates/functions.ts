import { Style } from '../style';
import wrap from 'word-wrap';

export function functionPrototypes(style: Style): string {
  return [
    '/**',
    ` * @brief ${style.soaManagerStruct} Instance Allocator.`,
    wrap('Creates the SOA management structure instance behind the scene.', { indent: ' * ', width: 76 }),
    ` * @sa ${style.soaManagerDestroyFunc}`,
    ' */',
    `${style.soaManagerStruct}* ${style.soaManagerCreateFunc}(void);`,
    '',
    '/**',
    ` * @brief ${style.soaManagerStruct} Instance Deallocation`,
    wrap('Destroys the SOA management structure instance behind the scene.', { indent: ' * ', width: 76 }),
    ` * @sa ${style.soaManagerCreateFunc}`,
    ' */',
    `void ${style.soaManagerDestroyFunc}(${style.soaManagerStruct} *mgr);`,
    '',
    '/**',
    ` * @brief ${style.soaStruct} Instance Allocator.`,
    wrap(`This function instantiates a new ${style.soaStruct} instance.`, { indent: ' * ', width: 76 }),
    ` * @sa ${style.soaGrabFunc}`,
    ` * @sa ${style.soaDropFunc}`,
    ' */',
    `${style.soaStruct} ${style.soaCreateFunc}(${style.soaManagerStruct} *mgr);`,
    '',
    '/**',
    ` * @brief Increments ${style.soaStruct} Instance Reference Count.`,
    ` * @sa ${style.soaDropFunc}`,
    ' */',
    `void ${style.soaGrabFunc}(${style.soaStruct} instance);`,
    '',
    '/**',
    ` * @brief Decrements ${style.soaStruct} Instance Reference Count.`,
    wrap(`If the reference count reaches 0, the ${style.soaStruct} instance will be destroyed.`, {
      indent: ' * ',
      width: 76
    }),
    ` * @sa ${style.soaGrabFunc}`,
    ' */',
    `void ${style.soaDropFunc}(${style.soaStruct} instance);`,
    '',
    style.soaFields
      .map((soaField) => {
        const comment = soaField.comment ? '\n' + wrap(soaField.comment, { indent: ' * ', width: 76 }) : '';
        const seeAlsoGetter = soaField.getterFunc ? `\n * @sa ${soaField.getterFunc}` : '';
        const seeAlsoSetter = soaField.setterFunc ? `\n * @sa ${soaField.setterFunc}` : '';

        const getter = soaField.getterFunc
          ? [
              '/**',
              ` * @brief Getter for ${soaField.name}${comment}`,
              ` * @param instance the ${style.soaStruct} instance.`,
              ` * @return The value of ${soaField.name}${seeAlsoSetter}`,
              ` */`,
              `${soaField.type} ${soaField.getterFunc}(${style.soaStruct} instance);`,
              ''
            ]
          : [];

        const setter = soaField.getterFunc
          ? [
              `/**`,
              ` * @brief Setter for ${soaField.name}${comment}`,
              ` * @param instance the ${style.soaStruct} instance.`,
              ` * @return The value of ${soaField.name}${seeAlsoGetter}`,
              ` */`,
              `void ${soaField.setterFunc}(${style.soaStruct} instance, ${soaField.type} ${soaField.name});`,
              ''
            ]
          : [];

        return getter.concat(setter).join('\n');
      })
      .join('\n\n')
  ].join('\n');
}

export function functionDefinitions(style: Style): string {
  return [
    `${style.soaManagerStruct}* ${style.soaManagerCreateFunc}(void)`,
    '{',
    style.tab(1, `${style.soaManagerStruct}* mgr = malloc(sizeof(${style.soaManagerStruct}));`),
    '',
    style.soaFields
      .map((soaField) =>
        style.tab(
          1,
          `mgr->${soaField.name} = ${style.macroAlignedAllocFunc}(${style.macroAlignmentDef}, ${style.macroAlignmentDef} * sizeof(${soaField.type}));`
        )
      )
      .join('\n'),
    style.tab(
      1,
      `mgr->_refCount = ${style.macroAlignedAllocFunc}(${style.macroAlignmentDef}, ${style.macroAlignmentDef} * sizeof(size_t));`
    ),
    style.tab(
      1,
      `mgr->_indexToInstanceMap = ${style.macroAlignedAllocFunc}(${style.macroAlignmentDef}, ${style.macroAlignmentDef} * sizeof(size_t));`
    ),
    style.tab(
      1,
      `mgr->_instanceToIndexMap = ${style.macroAlignedAllocFunc}(${style.macroAlignmentDef}, ${style.macroAlignmentDef} * sizeof(size_t));`
    ),
    style.tab(1, `mgr->_capacity = ${style.macroAlignmentDef};`),
    style.tab(1, `mgr->_count = 0;`),
    '',
    style.tab(1, `return mgr;`),
    '}',
    '',
    `void ${style.soaManagerDestroyFunc}(${style.soaManagerStruct}* mgr)`,
    '{',
    style.soaFields.map((soaField) => style.tab(1, `${style.macroAlignedFreeFunc}(mgr->${soaField.name});`)).join('\n'),
    style.tab(1, `${style.macroAlignedFreeFunc}(mgr->_refCount);`),
    style.tab(1, `${style.macroAlignedFreeFunc}(mgr->_indexToInstanceMap);`),
    style.tab(1, `${style.macroAlignedFreeFunc}(mgr->_instanceToIndexMap);`),
    '',
    style.soaFields.map((soaField) => style.tab(1, `mgr->${soaField.name} = NULL;`)).join('\n'),
    style.tab(1, `mgr->_refCount = NULL;`),
    style.tab(1, `mgr->_indexToInstanceMap = NULL;`),
    style.tab(1, `mgr->_instanceToIndexMap = NULL;`),
    style.tab(1, `mgr->_count = 0;`),
    style.tab(1, `mgr->_capacity = 0;`),
    '',
    style.tab(1, `free(mgr);`),
    '}',
    ''
  ].join('\n');
}
