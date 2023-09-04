import { readFileSync } from 'fs';
import _ from 'lodash';
import details from './details.json';
import { makeCIdentifier } from './utils';

import { Descriptor } from './descriptor';

export class soa_c {
  private descriptor: Descriptor;

  public constructor(descriptor: Descriptor) {
    this.descriptor = descriptor;
  }

  public getDescriptor(): Descriptor {
    return this.descriptor;
  }

  public generateSource(): string {
    const template = _.template(readFileSync(__dirname + '/templates/soa.c.template').toString());

    const params = {
      descriptor: this.descriptor
    };

    return template(params);
  }

  public generateHeader(): string {
    const template = _.template(readFileSync(__dirname + '/templates/soa.h.template').toString());

    const structName = makeCIdentifier(this.descriptor.name);

    const params = {
      descriptor: this.descriptor,
      details: details,
      structName: structName,
      guard: `${_.toUpper(structName)}_H`,
      makeCIdentifier,
      _
    };

    return template(params);
  }
}
