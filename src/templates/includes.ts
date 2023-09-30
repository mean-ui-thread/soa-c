import { Style } from '../style';

export function headerIncludes(style: Style): string {
  return style.includes.concat(['#include <stddef.h> /* size_t */']).join('\n');
}

export function sourceIncludes(style: Style): string {
  return [
    '#include <assert.h>',
    '#if defined(__APPLE__)',
    style.tab(1, '#include <malloc/malloc.h>'),
    style.tab(1, '#include <stdalign.h>'),
    style.tab(1, '#include <stdlib.h>'),
    style.tab(1, '#include <string.h>'),
    '#elif defined(__linux__)',
    style.tab(1, '#include <malloc.h>'),
    style.tab(1, '#include <stdalign.h>'),
    style.tab(1, '#include <stdlib.h>'),
    style.tab(1, '#include <string.h>'),
    '#elif defined(_MSC_VER)',
    style.tab(1, '#include <malloc.h>'),
    '#endif'
  ].join('\n');
}
