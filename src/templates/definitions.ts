import { Style } from '../style';

export function headerDefinitions(style: Style): string {
  return [`#define ${style.macroUnusedDef} SIZE_MAX`].join('\n');
}

export function sourceDefinitions(style: Style): string {
  return [
    `#ifndef ${style.macroAlignmentDef}`,
    style.tab(1, `#define ${style.macroAlignmentDef} 64 /* Large enough for AVX-512 */`),
    '#endif',
    '',
    `#ifndef ${style.macroAssertFunc}`,
    style.tab(1, `#define ${style.macroAssertFunc}(condition) assert(condition)`),
    '#endif',
    '',
    `#if defined(${style.macroAlignedAllocFunc}) && defined(${style.macroAlignedFreeFunc}) && defined(${style.macroAlignedReallocFunc})`,
    style.tab(1, '/* valid */'),
    `#elif !defined(${style.macroAlignedAllocFunc}) && !defined(${style.macroAlignedFreeFunc}) && !defined(${style.macroAlignedReallocFunc})`,
    style.tab(1, '/* valid */'),
    '#else',
    style.tab(
      1,
      `#error "Must define all or none of ${style.macroAlignedAllocFunc}, ${style.macroAlignedFreeFunc}, and ${style.macroAlignedReallocFunc}."`
    ),
    '#endif',
    '',
    `#ifndef ${style.macroMallocUsableSizeFunc}`,
    style.tab(1, `#if defined(__APPLE__)`),
    style.tab(2, `#define ${style.macroMallocUsableSizeFunc}(ptr) malloc_size(ptr)`),
    style.tab(1, `#elif defined(__linux__)`),
    style.tab(2, `#define ${style.macroMallocUsableSizeFunc}(ptr) malloc_usable_size(ptr)`),
    style.tab(1, `#else`),
    style.tab(2, `#define ${style.macroMallocUsableSizeFunc}(ptr)`),
    style.tab(1, `#endif`),
    `#endif /* ${style.macroMallocUsableSizeFunc} */`,
    '',
    `#if !defined(${style.macroAlignedFreeFunc}) && !defined(${style.macroAlignedAllocFunc}) && !defined(${style.macroAlignedReallocFunc})`,
    style.tab(1, `#if defined(__APPLE__) || defined(__linux__)`),
    style.tab(2, `#define ${style.macroAlignedFreeFunc}(ptr) free(ptr)`),
    style.tab(2, `#define ${style.macroAlignedAllocFunc}(align, size) aligned_alloc(align, size)`),
    style.tab(
      2,
      `#define ${style.macroAlignedReallocFunc}(ptr, align, size) ${style.alignedReallocFunc}(ptr, align, size)`
    ),
    style.tab(1, `#elif defined(_MSC_VER)`),
    style.tab(2, `#define ${style.macroAlignedFreeFunc}(ptr) _aligned_free(ptr)`),
    style.tab(2, `#define ${style.macroAlignedAllocFunc}(align, size) _aligned_alloc(size, align)`),
    style.tab(2, `#define ${style.macroAlignedReallocFunc}(ptr, align, size) _aligned_realloc(ptr, size, align);`),
    style.tab(1, `#else`),
    style.tab(2, `#define ${style.macroAlignedFreeFunc}(ptr) free(ptr)`),
    style.tab(2, `#define ${style.macroAlignedAllocFunc}(align, size) malloc(size)`),
    style.tab(2, `#define ${style.macroAlignedReallocFunc}(ptr, align, size) realloc(ptr, size)`),
    style.tab(1, `#endif`),
    '#endif'
  ].join('\n');
}
