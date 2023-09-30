import chalk from 'chalk';
import figlet from 'figlet';
import { Command, InvalidArgumentError } from 'commander';
import { PathLike, existsSync, readFileSync } from 'fs';

import { Convert, Descriptor } from './descriptor';
import * as descriptorSchema from './schema/descriptor.json';
import { soa_c } from './soa_c';

import { Constants } from './constants';

function parseDescriptorFileArg(descriptorFilePath: PathLike): Descriptor {
  console.log(chalk.bold.green(`Loading ${descriptorFilePath} ...`));

  if (!existsSync(descriptorFilePath)) {
    throw new InvalidArgumentError('File does not exist.');
  }

  const descriptorData = readFileSync(descriptorFilePath, 'utf-8').toString();
  if (descriptorData.length == 0) {
    throw new InvalidArgumentError('File could not be read or is empty.');
  }

  try {
    const descriptor: Descriptor = Convert.toDescriptor(descriptorData);
    return descriptor;
  } catch (err) {
    throw new InvalidArgumentError(`${err}`);
  }
}

new Command()
  .version(Constants.VERSION)
  .description(Constants.DESCRIPTION)
  .configureOutput({ outputError: (str, write) => write(chalk.bold.red(str)) })
  .addHelpText(
    'beforeAll',
    [
      '',
      chalk.bold.blue(`${figlet.textSync(Constants.NAME, 'ANSI Shadow').trim()} v${Constants.VERSION}`),
      chalk.blue(`By ${Constants.AUTHOR} - Copyright (c) ${Constants.RELEASED_YEAR} - All rights reserved`),
      chalk.greenBright(Constants.HOMEPAGE),
      ''
    ].join('\n')
  )
  .showHelpAfterError(chalk.yellow('(add --help for additional information)'))
  .argument('<descriptorFile>', 'JSON Descriptor file', parseDescriptorFileArg)
  .option('-o, --output-path <outputPath>', descriptorSchema.properties.outputPath.description)
  .action((descriptor: Descriptor, options) => {
    descriptor.outputPath = options.outputPath ?? descriptor.outputPath;
    soa_c(descriptor);
  })
  .parse(process.argv);
