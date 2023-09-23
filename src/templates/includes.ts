import { Descriptor } from '../descriptor';
import { Style } from '../style';

export function headerIncludes(descriptor: Descriptor, style: Style): string {
  void style;
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

export function sourceIncludes(descriptor: Descriptor, style: Style): string {
  return [
    '#include <assert.h>',
    '#if defined(__APPLE__)',
    `${style.indent}#include <malloc/malloc.h>`,
    `${style.indent}#include <stdalign.h>`,
    `${style.indent}#include <stdlib.h>`,
    `${style.indent}#include <string.h>`,
    '#elif defined(__linux__)',
    `${style.indent}#include <malloc.h>`,
    `${style.indent}#include <stdalign.h>`,
    `${style.indent}#include <stdlib.h>`,
    `${style.indent}#include <string.h>`,
    '#elif defined(_MSC_VER)',
    `${style.indent}#include <malloc.h>`,
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
