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

  public readonly _refCountVar: string;
  public readonly _soaToInstanceMapVar: string;
  public readonly _instanceToSoaMapVar: string;
  public readonly _countVar: string;
  public readonly _capacityVar: string;

  public readonly macroHeaderGuardDef: string;
  public readonly macroImplGuardDef: string;
  public readonly macroAlignmentDef: string;
  public readonly macroUnusedDef: string;
  public readonly macroAssertFunc: string;
  public readonly macroAlignedAllocFunc: string;
  public readonly macroAlignedFreeFunc: string;
  public readonly macroAlignedReallocFunc: string;
  public readonly macroMallocUsableSizeFunc: string;

  public readonly alignedReallocFunc: string;

  public readonly soaStruct: string;
  public readonly soaManagerVar: string;
  public readonly soaIndexVar: string;
  public readonly instanceIndexVar: string;
  public readonly soaCreateFunc: string;
  public readonly soaGrabFunc: string;
  public readonly soaDropFunc: string;

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

    this._refCountVar = '_' + this.createVariable(['ref', 'count']);
    this._soaToInstanceMapVar = '_' + this.createVariable(['soa', 'to', 'instance', 'map']);
    this._instanceToSoaMapVar = '_' + this.createVariable(['instance', 'to', 'soa', 'map']);
    this._countVar = '_' + this.createVariable(['count']);
    this._capacityVar = '_' + this.createVariable(['capacity']);

    // Adding private soaFields
    this.soaFields.push({
      id: this._refCountVar,
      name: this._refCountVar,
      type: 'size_t',
      comment: 'Instance reference counter.'
    });

    this.soaFields.push({
      id: this._instanceToSoaMapVar,
      name: this._instanceToSoaMapVar,
      type: 'size_t',
      comment: 'Instance to SOA index map.'
    });

    this.soaFields.push({
      id: this._soaToInstanceMapVar,
      name: this._soaToInstanceMapVar,
      type: 'size_t',
      comment: 'SOA to instance index map.'
    });

    this.macroHeaderGuardDef = this.createMacroDefinition([this.id, 'h']);
    this.macroImplGuardDef = this.createMacroDefinition([this.id, 'implementation']);
    this.macroAlignmentDef = this.createMacroDefinition([this.id, 'alignment']);
    this.macroUnusedDef = this.createMacroDefinition([this.id, 'unused']);
    this.macroAssertFunc = this.createMacroFunction([this.id, 'assert']);
    this.macroAlignedAllocFunc = this.createMacroFunction([this.id, 'aligned', 'alloc']);
    this.macroAlignedFreeFunc = this.createMacroFunction([this.id, 'aligned', 'free']);
    this.macroAlignedReallocFunc = this.createMacroFunction([this.id, 'aligned', 'realloc']);
    this.macroMallocUsableSizeFunc = this.createMacroFunction([this.id, 'malloc', 'usable', 'size']);

    this.alignedReallocFunc = '_' + this.createFunction([this.id, 'aligned', 'realloc']);

    this.soaStruct = this.createStruct([this.id]);
    this.soaManagerVar = this.createVariable(['manager']);
    this.soaIndexVar = this.createVariable(['soa', 'index']);
    this.instanceIndexVar = this.createVariable(['instance', 'index']);
    this.soaCreateFunc = this.createFunction([this.id, 'create']);
    this.soaGrabFunc = this.createFunction([this.id, 'grab']);
    this.soaDropFunc = this.createFunction([this.id, 'drop']);

    this.soaManagerStruct = this.createStruct([this.id, 'manager']);
    this.soaManagerCreateFunc = this.createFunction([this.id, 'manager', 'create']);
    this.soaManagerDestroyFunc = this.createFunction([this.id, 'manager', 'destroy']);

    this._indent = descriptor.style?.indent ?? '    ';
  }

  public tab(tabCount: number, line: string): string {
    return `${this._indent.repeat(tabCount)}${line}`;
  }
}
