import _ from 'lodash';
import { Descriptor } from '../descriptor';
import { Formatter } from '../types';
import wrap from 'word-wrap';

export function functionPrototypes(descriptor: Descriptor, formatter: Formatter): string {
  const managerStruct = `${formatter(`${descriptor.name} manager`)}_t`;
  const managerCreateFunc = formatter(`${descriptor.name} manager create`);
  const managerDestroyFunc = formatter(`${descriptor.name} manager destroy`);
  const instanceCreateFunc = formatter(`${descriptor.name} create`);
  const instanceDestroyFunc = formatter(`${descriptor.name} destroy`);

  return [
    '/**',
    ` * ${descriptor.name} manager create`,
    wrap('Creates the SOA management structure instance behind the scene.', { indent: ' * ', width: 76 }),
    ` * @sa ${managerDestroyFunc}`,
    ' */',
    `${managerStruct}* ${managerCreateFunc}(void);`,
    '',
    '/**',
    ` * ${descriptor.name} manager destroy`,
    wrap('Destroys the SOA management structure instance behind the scene.', { indent: ' * ', width: 76 }),
    ` * @sa ${managerCreateFunc}`,
    ' */',
    `void ${managerDestroyFunc}(${managerStruct} *mgr);`,
    '',
    '/**',
    ` * ${descriptor.name} Instance Allocator.`,
    wrap(`This function instantiates a new ${descriptor.name} instance`, { indent: ' * ', width: 76 }),
    ` * @sa ${instanceDestroyFunc}`,
    ' */',
    `${descriptor.name}_t ${instanceCreateFunc}(${managerStruct} *mgr);`,
    '',
    '/**',
    ` * ${descriptor.name} Instance Deallocator.`,
    wrap(`This function destroys a ${descriptor.name} instance`, { indent: ' * ', width: 76 }),
    ` * @sa ${instanceCreateFunc}`,
    ' */',
    `void ${instanceDestroyFunc}(${descriptor.name}_t instance);`,
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
      .join('\n\n')
  ].join('\n');
}

export function functionDefinitions(descriptor: Descriptor, formatter: Formatter): string {
  const macroPrefix = _.toUpper(_.snakeCase(descriptor.name));

  const managerStruct = `${formatter(`${descriptor.name} manager`)}_t`;
  const managerCreateFunc = formatter(`${descriptor.name} manager create`);
  const managerDestroyFunc = formatter(`${descriptor.name} manager destroy`);
  //const instanceCreateFunc = formatter(`${descriptor.name} create`);
  //const instanceDestroyFunc = formatter(`${descriptor.name} destroy`);

  return [
    `${managerStruct}* ${managerCreateFunc}(void)`,
    '{',
    `${descriptor.indent} ${managerStruct}* mgr = malloc(sizeof(${managerStruct}));`,
    '',
    descriptor.soaFields
      .sort()
      .map((soaField) => {
        return `${descriptor.indent}mgr->${soaField.name} = ${macroPrefix}_ALIGNED_ALLOC(${macroPrefix}_ALIGNMENT, ${macroPrefix}_ALIGNMENT * sizeof(${soaField.type}));`;
      })
      .join('\n'),
    `${descriptor.indent}mgr->_capacity = ${macroPrefix}_ALIGNMENT;`,
    `${descriptor.indent}mgr->_count = 0;`,
    '',
    `${descriptor.indent}mgr->_instances.idx = ${macroPrefix}_ALIGNED_ALLOC(${macroPrefix}_ALIGNMENT, ${macroPrefix}_ALIGNMENT * sizeof(size_t));`,
    `${descriptor.indent}mgr->_instances._capacity = ${macroPrefix}_ALIGNMENT;`,
    `${descriptor.indent}mgr->_instances._count = 0;`,
    '',
    `${descriptor.indent}mgr->_available.idx = ${macroPrefix}_ALIGNED_ALLOC(${macroPrefix}_ALIGNMENT, ${macroPrefix}_ALIGNMENT * sizeof(size_t));`,
    `${descriptor.indent}mgr->_available._capacity = ${macroPrefix}_ALIGNMENT;`,
    `${descriptor.indent}mgr->_available._count = 0;`,
    '',
    `${descriptor.indent}return mgr;`,
    '}',
    '',
    `void ${managerDestroyFunc}(${managerStruct}* mgr)`,
    '{',
    descriptor.soaFields
      .sort()
      .map((soaField) => {
        return `${descriptor.indent}${macroPrefix}_ALIGNED_FREE(mgr->${soaField.name});`;
      })
      .join('\n'),
    descriptor.soaFields
      .sort()
      .map((soaField) => {
        return `${descriptor.indent}mgr->${soaField.name} = NULL;`;
      })
      .join('\n'),
    `${descriptor.indent}mgr->_count = 0;`,
    `${descriptor.indent}mgr->_capacity = 0;`,
    '',
    `${descriptor.indent}${macroPrefix}_ALIGNED_FREE(mgr->_instances.idx);`,
    `${descriptor.indent}mgr->_instances.idx = NULL;`,
    `${descriptor.indent}mgr->_instances._count = 0;`,
    `${descriptor.indent}mgr->_instances._capacity = 0;`,
    '',
    `${descriptor.indent}${macroPrefix}_ALIGNED_FREE(mgr->_available.idx);`,
    `${descriptor.indent}mgr->_available.idx = NULL;`,
    `${descriptor.indent}mgr->_available._count = 0;`,
    `${descriptor.indent}mgr->_available._capacity = 0;`,
    '',
    `${descriptor.indent}free(mgr);`,
    '}',
    ''
  ].join('\n');
}
