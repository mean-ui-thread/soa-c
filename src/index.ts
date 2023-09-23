import chalk from 'chalk';
import figlet from 'figlet';
import { Command, InvalidArgumentError } from 'commander';
import { PathLike, existsSync, readFileSync } from 'fs';

import { Convert, Descriptor } from './descriptor';
import { soa_c } from './soa_c';

import { Constants } from './constants';

function parseDescriptorFileArg(descriptorFilePath: PathLike) {
  console.log(chalk.bold.green(`Loading ${descriptorFilePath} ...`));

  if (!existsSync(descriptorFilePath)) {
    throw new InvalidArgumentError(`'${descriptorFilePath}' does not exist.`);
  }

  const data = readFileSync(descriptorFilePath, 'utf-8').toString();
  if (data.length == 0) {
    throw new InvalidArgumentError(`'${descriptorFilePath}' file is empty.`);
  }

  try {
    const result: Descriptor = Convert.toDescriptor(data);
    return result;
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
  .option(
    '-o, --output-path <outputPath>',
    "The path where to output the generated source file. This also overrides the 'descriptor.outputPath' from the descriptor file if it was specified. If unspecified from neither descriptor.outputPath nor the command line option, soa-c will output the generated code content through the standard output."
  )
  .action((descriptorFile: Descriptor, options) => {
    if (options.outputPath) {
      descriptorFile.outputPath = options.outputPath;
    }
    soa_c(descriptorFile);
  })
  .parse(process.argv);
