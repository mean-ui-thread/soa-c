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
    `void ${style.soaManagerDestroyFunc}(${style.soaManagerStruct} *${style.soaManagerVar});`,
    '',
    '/**',
    ` * @brief ${style.soaStruct} Instance Allocator.`,
    wrap(`This function instantiates a new ${style.soaStruct} instance.`, { indent: ' * ', width: 76 }),
    ` * @sa ${style.soaGrabFunc}`,
    ` * @sa ${style.soaDropFunc}`,
    ' */',
    `${style.soaStruct} ${style.soaCreateFunc}(${style.soaManagerStruct} *${style.soaManagerVar});`,
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
              `inline ${soaField.type} ${soaField.getterFunc}(${style.soaStruct} instance)`,
              '{',
              style.tab(1, `assert(instance.${style.soaManagerVar});`),
              style.tab(1, `assert(instance.${style.instanceIndexVar} != ${style.macroUnusedDef});`),
              style.tab(
                1,
                `size_t ${style.soaIndexVar} = instance.${style.soaManagerVar}->${style._instanceToSoaMapVar}[instance.${style.instanceIndexVar}];`
              ),
              style.tab(1, `assert(${style.soaIndexVar} != ${style.macroUnusedDef});`),
              style.tab(1, `return instance.${style.soaManagerVar}->${soaField.name}[${style.soaIndexVar}];`),
              '}',
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
              `inline void ${soaField.setterFunc}(${style.soaStruct} instance, ${soaField.type} ${soaField.name})`,
              '{',
              style.tab(1, `assert(instance.${style.soaManagerVar});`),
              style.tab(
                1,
                `size_t ${style.soaIndexVar} = instance.${style.soaManagerVar}->${style._instanceToSoaMapVar}[instance.${style.instanceIndexVar}];`
              ),
              style.tab(1, `assert(${style.soaIndexVar} != ${style.macroUnusedDef});`),
              style.tab(
                1,
                `instance.${style.soaManagerVar}->${soaField.name}[${style.soaIndexVar}] = ${soaField.name};`
              ),
              '}',
              ''
            ]
          : [];

        return getter.concat(setter).join('\n');
      })
      .join('\n')
  ].join('\n');
}

function alignedReallocFuncDefinition(style: Style): string {
  const newSizeVar = style.createVariable(['new', 'size']);
  const newPtrVar = style.createVariable(['new', 'ptr']);
  const oldUsableSizeVar = style.createVariable(['old', 'usable', 'size']);
  const copySizeVar = style.createVariable(['copy', 'size']);
  return [
    '#if defined(__APPLE__) || defined(__linux__)',
    '/**',
    ' * @brief Realloc helper function for macos and linux.',
    ' * @param ptr the pointer to the buffer to resize',
    ' * @param align The alignment value, which must be an integer power of 2.',
    ' * @param size The size of the requested memory allocation, which must be a multiple of align',
    ' * @return the new reallocated buffer with its new size',
    ' */',
    `inline void* ${style.alignedReallocFunc}(void* ptr, size_t align, size_t size)`,
    '{',
    style.tab(1, `if ((size == 0) || (align <= alignof(max_align_t)))`),
    style.tab(1, `{`),
    style.tab(2, `return realloc(ptr, size);`),
    style.tab(1, `}`),
    style.tab(1, `size_t ${newSizeVar} = (size + (align - 1)) & (~(align - 1));`),
    style.tab(1, `void *${newPtrVar} = ${style.macroAlignedAllocFunc}(align, ${newSizeVar});`),
    style.tab(1, `if (${newPtrVar} != NULL)`),
    style.tab(1, `{`),
    style.tab(2, `size_t ${oldUsableSizeVar} = ${style.macroMallocUsableSizeFunc}(ptr);`),
    style.tab(2, `size_t ${copySizeVar} = ${newSizeVar} < ${oldUsableSizeVar} ? ${newSizeVar} : ${oldUsableSizeVar};`),
    style.tab(2, `if (ptr != NULL)`),
    style.tab(3, `{`),
    style.tab(3, `memcpy(${newPtrVar}, ptr, ${copySizeVar});`),
    style.tab(3, `free(ptr);`),
    style.tab(2, `}`),
    style.tab(1, `}`),
    style.tab(1, `return ${newPtrVar};`),
    '}',
    '#endif',
    ''
  ].join('\n');
}

function soaManagerCreateFuncDefinition(style: Style): string {
  return [
    `${style.soaManagerStruct}* ${style.soaManagerCreateFunc}(void)`,
    '{',
    style.tab(1, `${style.soaManagerStruct}* ${style.soaManagerVar} = malloc(sizeof(${style.soaManagerStruct}));`),
    style.tab(1, `assert(${style.soaManagerVar});`),
    '',
    style.soaFields
      .map((soaField) =>
        style.tab(
          1,
          `${style.soaManagerVar}->${soaField.name} = ${style.macroAlignedAllocFunc}(${style.macroAlignmentDef}, ${style.macroAlignmentDef} * sizeof(${soaField.type}));`
        )
      )
      .join('\n'),
    style.tab(
      1,
      `memset(${style.soaManagerVar}->${style._soaToInstanceMapVar}, 0xFF, ${style.macroAlignmentDef} * sizeof(size_t));`
    ),
    style.tab(
      1,
      `memset(${style.soaManagerVar}->${style._instanceToSoaMapVar}, 0xFF, ${style.macroAlignmentDef} * sizeof(size_t));`
    ),
    style.tab(1, `${style.soaManagerVar}->${style._capacityVar} = ${style.macroAlignmentDef};`),
    style.tab(1, `${style.soaManagerVar}->${style._countVar} = 0;`),
    '',
    style.tab(1, `return ${style.soaManagerVar};`),
    '}',
    ''
  ].join('\n');
}

function soaManagerDestroyFuncDefinition(style: Style): string {
  return [
    `void ${style.soaManagerDestroyFunc}(${style.soaManagerStruct}* ${style.soaManagerVar})`,
    '{',
    style.tab(1, `assert(${style.soaManagerVar});`),
    style.soaFields
      .map((soaField) => style.tab(1, `${style.macroAlignedFreeFunc}(${style.soaManagerVar}->${soaField.name});`))
      .join('\n'),
    '',
    style.tab(1, `free(${style.soaManagerVar});`),
    '}',
    ''
  ].join('\n');
}

function soaCreateFuncDefinition(style: Style): string {
  return [
    `${style.soaStruct} ${style.soaCreateFunc}(${style.soaManagerStruct} *${style.soaManagerVar}) {`,
    style.tab(1, `assert(${style.soaManagerVar});`),
    style.tab(1, `size_t ${style.instanceIndexVar} = 0;`),
    style.tab(1, `size_t ${style.soaIndexVar} = 0;`),
    '',
    style.tab(1, `if(${style.soaManagerVar}->${style._countVar} == ${style.soaManagerVar}->${style._capacityVar})`),
    style.tab(1, '{'),
    style.tab(
      2,
      `${style.soaManagerVar}->${style._capacityVar} = ${style.soaManagerVar}->${style._capacityVar} << 1; /* doubles the capacity */`
    ),
    style.soaFields
      .map((soaField) =>
        style.tab(
          2,
          `${style.soaManagerVar}->${soaField.name} = ${style.macroAlignedReallocFunc}(${style.soaManagerVar}->${soaField.name}, ${style.macroAlignmentDef}, ${style.macroAlignmentDef} * sizeof(${soaField.type}));`
        )
      )
      .join('\n'),
    '',
    style.tab(2, '/* Fast Forward since we know anything before that is in-use. */'),
    style.tab(2, `${style.instanceIndexVar} = ${style.soaManagerVar}->${style._countVar};`),
    style.tab(2, `${style.soaIndexVar} = ${style.soaManagerVar}->${style._countVar};`),
    style.tab(1, '}'),
    '',
    style.tab(
      1,
      `for(; ${style.instanceIndexVar} < ${style.soaManagerVar}->${style._capacityVar}; ++${style.instanceIndexVar})`
    ),
    style.tab(1, '{'),
    style.tab(
      2,
      `if (${style.soaManagerVar}->${style._soaToInstanceMapVar}[${style.instanceIndexVar}] == ${style.macroUnusedDef}) /* which means unused and available */`
    ),
    style.tab(2, '{'),
    style.tab(3, `for(; ${style.soaIndexVar} < ${style.soaManagerVar}->${style._capacityVar}; ++${style.soaIndexVar})`),
    style.tab(3, '{'),
    style.tab(
      4,
      `if(${style.soaManagerVar}->${style._instanceToSoaMapVar}[${style.soaIndexVar}] == ${style.macroUnusedDef}) /* which means unused and available */`
    ),
    style.tab(4, '{'),
    style.tab(5, `${style.soaManagerVar}->${style._refCountVar}[${style.instanceIndexVar}] = 1;`),
    style.tab(
      5,
      `${style.soaManagerVar}->${style._instanceToSoaMapVar}[${style.instanceIndexVar}] = ${style.soaIndexVar};`
    ),
    style.tab(
      5,
      `${style.soaManagerVar}->${style._soaToInstanceMapVar}[${style.soaIndexVar}] = ${style.instanceIndexVar};`
    ),
    style.tab(5, `++${style.soaManagerVar}->${style._countVar};`),
    style.tab(
      5,
      `return (${style.soaStruct}){.${style.soaManagerVar} = ${style.soaManagerVar}, .${style.instanceIndexVar} = ${style.instanceIndexVar}};`
    ),
    style.tab(4, '}'),
    style.tab(3, '}'),
    style.tab(2, '}'),
    style.tab(1, '}'),
    '',
    style.tab(
      1,
      `return (${style.soaStruct}){.${style.soaManagerVar} = ${style.soaManagerVar}, .${style.instanceIndexVar} = ${style.instanceIndexVar}};`
    ),
    '}',
    ''
  ].join('\n');
}

function soaGrabFuncDefinition(style: Style): string {
  return [
    `void ${style.soaGrabFunc}(${style.soaStruct} instance)`,
    '{',
    style.tab(1, `assert(instance.${style.soaManagerVar});`),
    style.tab(1, `assert(instance.${style.instanceIndexVar} != ${style.macroUnusedDef});`),
    style.tab(1, `++instance.${style.soaManagerVar}->${style._refCountVar}[instance.${style.instanceIndexVar}];`),

    '}',
    ''
  ].join('\n');
}

function soaDropFuncDefinition(style: Style): string {
  return [
    `void ${style.soaDropFunc}(${style.soaStruct} instance)`,
    '{',
    style.tab(1, `assert(instance.${style.soaManagerVar});`),
    style.tab(1, `assert(instance.${style.instanceIndexVar} != ${style.macroUnusedDef});`),
    style.tab(
      1,
      `if(--instance.${style.soaManagerVar}->${style._refCountVar}[instance.${style.instanceIndexVar}] == 0)`
    ),
    style.tab(1, '{'),
    style.tab(
      2,
      `size_t ${style.soaIndexVar} = instance.${style.soaManagerVar}->${style._instanceToSoaMapVar}[instance.${style.instanceIndexVar}];`
    ),
    style.tab(2, `assert(${style.soaIndexVar} != ${style.macroUnusedDef});`),
    style.tab(
      2,
      `instance.${style.soaManagerVar}->${style._instanceToSoaMapVar}[instance.${style.instanceIndexVar}] = ${style.macroUnusedDef};`
    ),
    style.tab(
      2,
      `instance.${style.soaManagerVar}->${style._soaToInstanceMapVar}[${style.soaIndexVar}] = ${style.macroUnusedDef};`
    ),
    style.tab(2, `instance.${style.soaManagerVar} = NULL;`),
    style.tab(2, `instance.${style.instanceIndexVar} = ${style.macroUnusedDef};`),
    style.tab(1, '}'),
    '}',
    ''
  ].join('\n');
}

export function functionDefinitions(style: Style): string {
  return [
    alignedReallocFuncDefinition(style),
    soaManagerCreateFuncDefinition(style),
    soaManagerDestroyFuncDefinition(style),
    soaCreateFuncDefinition(style),
    soaGrabFuncDefinition(style),
    soaDropFuncDefinition(style)
  ].join('\n');
}
