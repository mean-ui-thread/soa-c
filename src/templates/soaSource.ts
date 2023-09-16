import { Descriptor } from '../descriptor';
import { Formatter } from '../types';
import heading from './heading';

export default function soaHeader(descriptor: Descriptor, formatter: Formatter): string {
  const soaStruct = `${formatter(`${descriptor.name} soa`)}_t`;
  const poolStruct = `${formatter(`${descriptor.name} pool`)}_t`;
  const indent = descriptor.indent;

  const soa = `_${formatter(`${descriptor.name} soa`)}`;
  const instancePool = `_${formatter(`${descriptor.name} instance pool`)}`;
  const availablePool = `_${formatter(`${descriptor.name} available pool`)}`;

  return [
    heading(descriptor),
    `#include "${descriptor.name}.h"`,
    '',
    '#include <stdlib.h> /* malloc, realloc, free */',
    descriptor.sourceIncludes
      ?.map((include) => {
        const comment = include.comment ? ' /* ' + include.comment + ' */' : '';
        if (include.isLocal) {
          return `#include "${include.fileName}"${comment}`;
        } else {
          return `#include <${include.fileName}>${comment}`;
        }
      })
      .join('\n'),
    '',
    'typedef struct',
    '{',
    descriptor.soaFields
      .sort()
      .map((soaField) => {
        return `${indent}${soaField.type}* ${soaField.name};`;
      })
      .join('\n'),
    `${indent}size_t _count;`,
    `${indent}size_t _capacity;`,
    `} ${soaStruct};`,
    '',
    'typedef struct',
    '{',
    `${indent}size_t* idx;`,
    `${indent}size_t count;`,
    `${indent}size_t capacity;`,
    `} ${poolStruct};`,
    '',
    `static ${soaStruct} ${soa} = {0};`,
    `static ${poolStruct} ${instancePool} = {0};`,
    `static ${poolStruct} ${availablePool} = {0};`,
    '',
    `void ${formatter(`${descriptor.name} init`)}()`,
    '{',
    `${indent}if (${soa}._capacity != 0)`,
    `${indent}{`,
    `${indent}${indent}return; /* ${descriptor.name} is already initialized */`,
    `${indent}}`,
    '',
    descriptor.soaFields
      .sort()
      .map((soaField) => {
        return `${descriptor.indent}${soa}.${soaField.name} = ${descriptor.instanceAllocator}(${descriptor.instanceInitialCapacity} * sizeof(${soaField.type}));`;
      })
      .join('\n'),
    `${indent}${soa}._capacity = ${descriptor.instanceInitialCapacity};`,
    '',
    `${indent}${instancePool}.idx = ${descriptor.instanceAllocator}(${descriptor.instanceInitialCapacity} * sizeof(size_t));`,
    `${indent}${instancePool}.capacity = ${descriptor.instanceInitialCapacity};`,
    '',
    `${indent}${availablePool}.idx = ${descriptor.instanceAllocator}(${descriptor.instanceInitialCapacity} * sizeof(size_t));`,
    `${indent}${availablePool}.capacity = ${descriptor.instanceInitialCapacity};`,
    '}',
    '',
    `void ${formatter(`${descriptor.name} shutdown`)}()`,
    '{',
    `${indent}if (${soa}._capacity == 0)`,
    `${indent}{`,
    `${indent}${indent}return; /* ${descriptor.name} is already uninitialized */`,
    `${indent}}`,
    '',
    descriptor.soaFields
      .sort()
      .map((soaField) => {
        return `${descriptor.indent}${descriptor.instanceDeallocator}(${soa}.${soaField.name});`;
      })
      .join('\n'),
    descriptor.soaFields
      .sort()
      .map((soaField) => {
        return `${descriptor.indent}${soa}.${soaField.name} = NULL;`;
      })
      .join('\n'),
    `${indent}${soa}._count = 0;`,
    `${indent}${soa}._capacity = 0;`,
    '',
    `${indent}${descriptor.instanceDeallocator}(${instancePool}.idx);`,
    `${indent}${instancePool}.idx = NULL;`,
    `${indent}${instancePool}.count = 0;`,
    `${indent}${instancePool}.capacity = 0;`,
    '',
    `${indent}${descriptor.instanceDeallocator}(${availablePool}.idx);`,
    `${indent}${availablePool}.idx = NULL;`,
    `${indent}${availablePool}.count = 0;`,
    `${indent}${availablePool}.capacity = 0;`,
    '}',
    ''
  ].join('\n');
}
