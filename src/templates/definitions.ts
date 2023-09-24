import { Style } from '../style';

export default function definitions(style: Style): string {
  return [
    `${style.tab('')}#ifndef ${style.macroAlignmentDef}`,
    `${style.tab(' ')}#define ${style.macroAlignmentDef} 64 /* Large enough for AVX-512 */`,
    `${style.tab('')}#endif`,
    '',
    `${style.tab('')}#ifndef ${style.macroAssertFunc}`,
    `${style.tab(' ')}#define ${style.macroAssertFunc}(condition) assert(condition)`,
    `${style.tab('')}#endif`,
    '',
    `${style.tab('')}#if defined(${style.macroAlignedAllocFunc}) && defined(${style.macroAlignedFreeFunc}) && defined(${
      style.macroAlignedReallocFunc
    })`,
    `${style.tab(' ')}/* valid */`,
    `${style.tab('')}#elif !defined(${style.macroAlignedAllocFunc}) && !defined(${
      style.macroAlignedFreeFunc
    }) && !defined(${style.macroAlignedReallocFunc})`,
    `${style.tab(' ')}/* valid */`,
    `${style.tab('')}#else`,
    `${style.tab(' ')}#error "Must define all or none of ${style.macroAlignedAllocFunc}, ${
      style.macroAlignedFreeFunc
    }, and ${style.macroAlignedReallocFunc}."`,
    `${style.tab('')}#endif`,
    '',
    `${style.tab('')}#ifndef ${style.macroMallocUsableSizeFunc}`,
    `${style.tab(' ')}#if defined(__APPLE__)`,
    `${style.tab('  ')}#define ${style.macroMallocUsableSizeFunc}(ptr) malloc_size(ptr)`,
    `${style.tab(' ')}#elif defined(__linux__)`,
    `${style.tab('  ')}#define ${style.macroMallocUsableSizeFunc}(ptr) malloc_usable_size(ptr)`,
    `${style.tab(' ')}#else`,
    `${style.tab('  ')}#define ${style.macroMallocUsableSizeFunc}(ptr)`,
    `${style.tab(' ')}#endif`,
    `${style.tab('')}#endif /* ${style.macroMallocUsableSizeFunc} */`,
    '',
    `${style.tab('')}#if !defined(${style.macroAlignedFreeFunc}) && !defined(${
      style.macroAlignedAllocFunc
    }) && !defined(${style.macroAlignedReallocFunc})`,
    `${style.tab(' ')}#if defined(__APPLE__) || defined(__linux__)`,
    `${style.tab('  ')}#define ${style.macroAlignedFreeFunc}(ptr) free(ptr)`,
    `${style.tab('  ')}#define ${style.macroAlignedAllocFunc}(align, size) aligned_alloc(align, size)`,
    `${style.tab('  ')}#define ${style.macroAlignedReallocFunc}(ptr, align, size) do {\\`,
    `${style.tab('   ')}if ((size == 0) || (align <= alignof(max_align_t)))\\`,
    `${style.tab('   ')}{\\`,
    `${style.tab('    ')}return realloc(ptr, size);\\`,
    `${style.tab('   ')}}\\`,
    `${style.tab('   ')}size_t new_size = (size + (align - 1)) & (~(align - 1));\\`,
    `${style.tab('   ')}void *new_ptr = aligned_alloc(align, new_size);\\`,
    `${style.tab('   ')}if (new_ptr != NULL)\\`,
    `${style.tab('   ')}{\\`,
    `${style.tab('    ')}size_t old_usable_size = ${style.macroMallocUsableSizeFunc}(ptr);\\`,
    `${style.tab('    ')}size_t copy_size = new_size < old_usable_size ? new_size : old_usable_size;\\`,
    `${style.tab('    ')}if (ptr != NULL)\\`,
    `${style.tab('    ')}{\\`,
    `${style.tab('     ')}memcpy(new_ptr, ptr, copy_size);\\`,
    `${style.tab('     ')}free(ptr);\\`,
    `${style.tab('    ')}}\\`,
    `${style.tab('   ')}}\\`,
    `${style.tab('   ')}return new_ptr;\\`,
    `${style.tab('  ')}} while(0)`,
    `${style.tab(' ')}#elif defined(_MSC_VER)`,
    `${style.tab('  ')}#define ${style.macroAlignedFreeFunc}(ptr) _aligned_free(ptr)`,
    `${style.tab('  ')}#define ${style.macroAlignedAllocFunc}(align, size) _aligned_alloc(size, align)`,
    `${style.tab('  ')}#define ${style.macroAlignedReallocFunc}(ptr, align, size) _aligned_realloc(ptr, size, align);`,
    `${style.tab(' ')}#else`,
    `${style.tab('  ')}#define ${style.macroAlignedFreeFunc}(ptr) free(ptr)`,
    `${style.tab('  ')}#define ${style.macroAlignedAllocFunc}(align, size) malloc(size)`,
    `${style.tab('  ')}#define ${style.macroAlignedReallocFunc}(ptr, align, size) realloc(ptr, size)`,
    `${style.tab(' ')}#endif`,
    `${style.tab('')}#endif`
  ].join('\n');
}
