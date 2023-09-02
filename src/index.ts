import chalk from 'chalk';
import figlet from 'figlet';
import { Command } from 'commander';

//add the following line
const program = new Command();

console.log(chalk.blue(figlet.textSync('SOA-c', 'ANSI Shadow')));

program
  .version('1.0.0')
  .description('An CLI that code generate Struct-of-Arrays (SOA) C code from a JSON descriptor file.')
  .option('-c, --config  [value]', 'JSON Descriptor file')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

//const options = program.opts();
