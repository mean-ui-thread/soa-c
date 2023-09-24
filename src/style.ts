import { FormatterFunction } from './types';
import { Descriptor, NamingConvention } from './descriptor';
import { StringUtils } from './stringUtils';

function getFormatter(namingConvention: NamingConvention): FormatterFunction {
  switch (namingConvention) {
    case NamingConvention.CamelCase:
      return StringUtils.toCamelCase;
    case NamingConvention.PascalCase:
      return StringUtils.toPascalCase;
    case NamingConvention.ScreamingSnakeCase:
      return StringUtils.toScreamingSnakeCase;
    case NamingConvention.SnakeCase:
      return StringUtils.toSnakeCase;
  }
}

export interface SOAField {
  id: string;
  name: string;
  type: string;
  comment?: string;
  getterFunc?: string;
  setterFunc?: string;
}

export class Style {
  public readonly createConstantVariable: FormatterFunction;
  public readonly createFunction: FormatterFunction;
  public readonly createVariable: FormatterFunction;
  public readonly createMacroDefinition: FormatterFunction;
  public readonly createMacroFunction: FormatterFunction;
  public readonly createStruct: FormatterFunction;

  public readonly id: string;
  public readonly description?: string;
  public readonly author?: string;
  public readonly email?: string;
  public readonly homepage?: string;
  public readonly license?: string;

  public readonly includes: string[];

  public readonly soaFields: SOAField[];

  public readonly macroHeaderGuardDef: string;
  public readonly macroImplGuardDef: string;
  public readonly macroAlignmentDef: string;
  public readonly macroAssertFunc: string;
  public readonly macroAlignedAllocFunc: string;
  public readonly macroAlignedFreeFunc: string;
  public readonly macroAlignedReallocFunc: string;
  public readonly macroMallocUsableSizeFunc: string;

  public readonly soaStruct: string;
  public readonly soaCreateFunc: string;
  public readonly soaDestroyFunc: string;

  public readonly soaIndexStruct: string;

  public readonly soaManagerStruct: string;
  public readonly soaManagerCreateFunc: string;
  public readonly soaManagerDestroyFunc: string;

  private readonly _indent: string;

  public constructor(descriptor: Descriptor) {
    this.createConstantVariable = getFormatter(
      descriptor.style?.constantVariable ?? NamingConvention.ScreamingSnakeCase
    );
    this.createFunction = getFormatter(descriptor.style?.function ?? NamingConvention.CamelCase);
    (this.createMacroDefinition = getFormatter(
      descriptor.style?.macroDefinition ?? NamingConvention.ScreamingSnakeCase
    )),
      (this.createMacroFunction = getFormatter(descriptor.style?.macroFunction ?? NamingConvention.ScreamingSnakeCase)),
      (this.createStruct = getFormatter(descriptor.style?.struct ?? NamingConvention.PascalCase));
    this.createVariable = getFormatter(descriptor.style?.variable ?? NamingConvention.CamelCase);

    this.id = StringUtils.toCIdentifier(descriptor.name);
    this.description = descriptor.description;
    this.author = descriptor.author;
    this.email = descriptor.email;
    this.homepage = descriptor.homepage;
    this.license = descriptor.license;

    this.includes = descriptor.includes
      ? descriptor.includes.map((include) => {
          const comment = include.comment ? ' /* ' + include.comment + ' */' : '';
          if (include.isLocal ?? true) {
            return `#include "${include.fileName}"${comment}`;
          } else {
            return `#include <${include.fileName}>${comment}`;
          }
        })
      : [];

    this.soaFields = descriptor.soaFields.sort().map((soaField) => {
      const id = StringUtils.toCIdentifier(soaField.name);
      const generateGetter = soaField.generateGetter ?? true;
      const generateSetter = soaField.generateSetter ?? true;
      return {
        id: id,
        name: this.createVariable([id]),
        type: soaField.type,
        comment: soaField.comment,
        getterFunc: generateGetter ? this.createFunction([this.id, 'get', id]) : undefined,
        setterFunc: generateSetter ? this.createFunction([this.id, 'set', id]) : undefined
      };
    });

    this.macroHeaderGuardDef = this.createMacroDefinition([this.id, 'h']);
    this.macroImplGuardDef = this.createMacroDefinition([this.id, 'implementation']);
    this.macroAlignmentDef = this.createMacroDefinition([this.id, 'alignment']);
    this.macroAssertFunc = this.createMacroFunction([this.id, 'assert']);
    this.macroAlignedAllocFunc = this.createMacroFunction([this.id, 'aligned', 'alloc']);
    this.macroAlignedFreeFunc = this.createMacroFunction([this.id, 'aligned', 'free']);
    this.macroAlignedReallocFunc = this.createMacroFunction([this.id, 'aligned', 'realloc']);
    this.macroMallocUsableSizeFunc = this.createMacroFunction([this.id, 'malloc', 'usable', 'size']);

    this.soaStruct = this.createStruct([this.id]);
    this.soaCreateFunc = this.createFunction([this.id, 'create']);
    this.soaDestroyFunc = this.createFunction([this.id, 'destroy']);

    this.soaIndexStruct = this.createStruct([this.id, 'index']);

    this.soaManagerStruct = this.createStruct([this.id, 'manager']);
    this.soaManagerCreateFunc = this.createFunction([this.id, 'manager', 'create']);
    this.soaManagerDestroyFunc = this.createFunction([this.id, 'manager', 'destroy']);

    this._indent = descriptor.style?.indent ?? '    ';
  }

  public tab(spaces: string): string {
    return this._indent.repeat(spaces.length);
  }
}
