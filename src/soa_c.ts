import { readFileSync } from 'fs';
import wrap from 'word-wrap';
import _ from 'lodash';
import details from './details.json';
import makeCIdentifier from './makeCIdentifier';

import { IDescriptor } from './descriptor';

export class soa_c {
  private descriptor: IDescriptor;

  public constructor(descriptor: IDescriptor) {
    this.descriptor = descriptor;
  }

  public getDescriptor(): IDescriptor {
    return this.descriptor;
  }

  public generateSource(): string {
    const template = _.template(readFileSync(__dirname + '/templates/soa.c.template').toString());

    // TODO

    const params = {
      descriptor: this.descriptor
    };

    return template(params);
  }

  public generateHeader(): string {
    const template = _.template(readFileSync(__dirname + '/templates/soa.h.template').toString());

    const params = {
      descriptor: this.descriptor,
      details: details,
      makeCIdentifier,
      wrap,
      _
    };

    return template(params);
  }
}
