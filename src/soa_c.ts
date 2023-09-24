import { existsSync, mkdirSync, writeFileSync } from 'fs';

import chalk from 'chalk';

import { Descriptor } from './descriptor';
import { Style } from './style';
import createSoaHeader from './templates/soaHeader';

export function soa_c(descriptor: Descriptor, outputPath: string) {
  const style: Style = new Style(descriptor);

  const headerFileContent = createSoaHeader(style);
  const headerFilePath = `${outputPath}/${style.soaStruct}.h`;

  if (!existsSync(outputPath)) {
    mkdirSync(outputPath);
  }

  writeFileSync(headerFilePath, headerFileContent);
  console.log(chalk.bold.green(`✔ Successfully generated ${headerFilePath}`));
}
