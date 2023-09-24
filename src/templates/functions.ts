import { Style } from '../style';
import wrap from 'word-wrap';

export function functionPrototypes(style: Style): string {
  return [
    '/**',
    ` * ${style.soaManagerStruct} Instance Allocator.`,
    wrap('Creates the SOA management structure instance behind the scene.', { indent: ' * ', width: 76 }),
    ` * @sa ${style.soaManagerDestroyFunc}`,
    ' */',
    `${style.soaManagerStruct}* ${style.soaManagerCreateFunc}(void);`,
    '',
    '/**',
    ` * ${style.soaManagerStruct} Instance Deallocation`,
    wrap('Destroys the SOA management structure instance behind the scene.', { indent: ' * ', width: 76 }),
    ` * @sa ${style.soaManagerCreateFunc}`,
    ' */',
    `void ${style.soaManagerDestroyFunc}(${style.soaManagerStruct} *mgr);`,
    '',
    '/**',
    ` * ${style.soaStruct} Instance Allocator.`,
    wrap(`This function instantiates a new ${style.soaStruct} instance.`, { indent: ' * ', width: 76 }),
    ` * @sa ${style.soaDestroyFunc}`,
    ' */',
    `${style.soaStruct} ${style.soaCreateFunc}(${style.soaManagerStruct} *mgr);`,
    '',
    '/**',
    ` * ${style.soaStruct} Instance Deallocation.`,
    wrap(`This function destroys a ${style.soaStruct} instance.`, { indent: ' * ', width: 76 }),
    ` * @sa ${style.soaCreateFunc}`,
    ' */',
    `void ${style.soaDestroyFunc}(${style.soaStruct} instance);`,
    '',
    style.soaFields
      .map((soaField) => {
        const comment = soaField.comment ? '\n' + wrap(soaField.comment, { indent: ' * ', width: 76 }) : '';
        const seeAlsoGetter = soaField.getterFunc ? `\n * @sa ${soaField.getterFunc}` : '';
        const seeAlsoSetter = soaField.setterFunc ? `\n * @sa ${soaField.setterFunc}` : '';

        const getter = soaField.getterFunc
          ? [
              '/**',
              ` * Getter for ${soaField.name}${comment}`,
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
              ` * Setter for ${soaField.name}${comment}`,
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
    `${style.tab('')}${style.soaManagerStruct}* ${style.soaManagerCreateFunc}(void)`,
    `${style.tab('')}{`,
    `${style.tab(' ')}${style.soaManagerStruct}* mgr = malloc(sizeof(${style.soaManagerStruct}));`,
    '',
    style.soaFields
      .map((soaField) => {
        return `${style.tab(' ')}mgr->${soaField.name} = ${style.macroAlignedAllocFunc}(${style.macroAlignmentDef}, ${
          style.macroAlignmentDef
        } * sizeof(${soaField.type}));`;
      })
      .join('\n'),
    `${style.tab(' ')}mgr->_capacity = ${style.macroAlignmentDef};`,
    `${style.tab(' ')}mgr->_count = 0;`,
    '',
    `${style.tab(' ')}mgr->_instances.idx = ${style.macroAlignedAllocFunc}(${style.macroAlignmentDef}, ${
      style.macroAlignmentDef
    } * sizeof(size_t));`,
    `${style.tab(' ')}mgr->_instances._capacity = ${style.macroAlignmentDef};`,
    `${style.tab(' ')}mgr->_instances._count = 0;`,
    '',
    `${style.tab(' ')}mgr->_available.idx = ${style.macroAlignedAllocFunc}(${style.macroAlignmentDef}, ${
      style.macroAlignmentDef
    } * sizeof(size_t));`,
    `${style.tab(' ')}mgr->_available._capacity = ${style.macroAlignmentDef};`,
    `${style.tab(' ')}mgr->_available._count = 0;`,
    '',
    `${style.tab(' ')}return mgr;`,
    `${style.tab('')}}`,
    '',
    `${style.tab('')}void ${style.soaManagerDestroyFunc}(${style.soaManagerStruct}* mgr)`,
    `${style.tab('')}{`,
    style.soaFields
      .map((soaField) => {
        return `${style.tab(' ')}${style.macroAlignedFreeFunc}(mgr->${soaField.name});`;
      })
      .join('\n'),
    style.soaFields
      .map((soaField) => {
        return `${style.tab(' ')}mgr->${soaField.name} = NULL;`;
      })
      .join('\n'),
    `${style.tab(' ')}mgr->_count = 0;`,
    `${style.tab(' ')}mgr->_capacity = 0;`,
    '',
    `${style.tab(' ')}${style.macroAlignedFreeFunc}(mgr->_instances.idx);`,
    `${style.tab(' ')}mgr->_instances.idx = NULL;`,
    `${style.tab(' ')}mgr->_instances._count = 0;`,
    `${style.tab(' ')}mgr->_instances._capacity = 0;`,
    '',
    `${style.tab(' ')}${style.macroAlignedFreeFunc}(mgr->_available.idx);`,
    `${style.tab(' ')}mgr->_available.idx = NULL;`,
    `${style.tab(' ')}mgr->_available._count = 0;`,
    `${style.tab(' ')}mgr->_available._capacity = 0;`,
    '',
    `${style.tab(' ')}free(mgr);`,
    '}',
    ''
  ].join('\n');
}
