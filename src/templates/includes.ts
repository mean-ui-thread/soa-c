import { Descriptor } from '../descriptor';

export function headerIncludes(descriptor: Descriptor): string {
  return [
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
      : ''
  ].join('\n');
}

export function sourceIncludes(descriptor: Descriptor): string {
  return [
    '#include <assert.h>',
    '#if defined(__APPLE__)',
    `${descriptor.indent}#include <malloc/malloc.h>`,
    `${descriptor.indent}#include <stdalign.h>`,
    `${descriptor.indent}#include <stdlib.h>`,
    `${descriptor.indent}#include <string.h>`,
    '#elif defined(__linux__)',
    `${descriptor.indent}#include <malloc.h>`,
    `${descriptor.indent}#include <stdalign.h>`,
    `${descriptor.indent}#include <stdlib.h>`,
    `${descriptor.indent}#include <string.h>`,
    '#elif defined(_MSC_VER)',
    `${descriptor.indent}#include <malloc.h>`,
    '#endif',
    descriptor.sourceIncludes
      ? descriptor.sourceIncludes
          .map((include) => {
            const comment = include.comment ? ' /* ' + include.comment + ' */' : '';
            if (include.isLocal) {
              return `#include "${include.fileName}"${comment}`;
            } else {
              return `#include <${include.fileName}>${comment}`;
            }
          })
          .join('\n')
      : ''
  ].join('\n');
}
