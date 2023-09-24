import { Style } from '../style';

export function headerIncludes(style: Style): string {
  return style.includes.concat(['#include <stddef.h> /* size_t */']).join('\n');
}

export function sourceIncludes(style: Style): string {
  return [
    `${style.tab('')}#include <assert.h>`,
    `${style.tab('')}#if defined(__APPLE__)`,
    `${style.tab(' ')}#include <malloc/malloc.h>`,
    `${style.tab(' ')}#include <stdalign.h>`,
    `${style.tab(' ')}#include <stdlib.h>`,
    `${style.tab(' ')}#include <string.h>`,
    `${style.tab('')}#elif defined(__linux__)`,
    `${style.tab(' ')}#include <malloc.h>`,
    `${style.tab(' ')}#include <stdalign.h>`,
    `${style.tab(' ')}#include <stdlib.h>`,
    `${style.tab(' ')}#include <string.h>`,
    `${style.tab('')}#elif defined(_MSC_VER)`,
    `${style.tab(' ')}#include <malloc.h>`,
    `${style.tab('')}#endif`
  ].join('\n');
}
