import { FormatterFunction } from './types';

export interface Style {
  constant: FormatterFunction;
  function: FormatterFunction;
  global: FormatterFunction;
  indent: string;
  macroDefinition: FormatterFunction;
  macroFunction: FormatterFunction;
  struct: FormatterFunction;
}
