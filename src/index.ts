import chalk from 'chalk';
import figlet from 'figlet';
import { Command, InvalidArgumentError } from 'commander';
import { PathLike, existsSync, readFileSync } from 'fs';

import { Convert, IDescriptor } from './descriptor';
import { soa_c } from './soa_c';

import details from './details.json';

console.log(chalk.bold.blue(figlet.textSync(details.name, 'ANSI Shadow') + `v${details.version}`));
console.log(chalk.blue(`By ${details.author} - Copyright (c) 2023 - All rights reserved`));
console.log(chalk.blue(details.homepage));

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
    const result: IDescriptor = Convert.toIDescriptor(data);
    return result;
  } catch (err) {
    throw new InvalidArgumentError(`${err}`);
  }
}

new Command()
  .version(details.version)
  .description(details.description)
  .configureOutput({ outputError: (str, write) => write(chalk.bold.red(str)) })
  .argument('<descriptorFile>', 'JSON Descriptor file', parseDescriptorFileArg)
  .showHelpAfterError(chalk.yellow('(add --help for additional information)'))
  .action((descriptorFile: IDescriptor) => {
    const generator = new soa_c(descriptorFile);
    const header = generator.generateHeader();
    console.log(header);
  })
  .parse(process.argv);
