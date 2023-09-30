import { existsSync, mkdirSync, PathLike, writeFileSync } from 'fs';

import chalk from 'chalk';

import { Descriptor } from './descriptor';
import * as descriptorSchema from './schema/descriptor.json';
import { Style } from './style';
import createSoaHeader from './templates/soaHeader';

export function soa_c(descriptor: Descriptor) {
  const style: Style = new Style(descriptor);

  const outputPath: PathLike = descriptor.outputPath ?? descriptorSchema.properties.outputPath.default;

  const headerFileContent = createSoaHeader(style);
  const headerFilePath = `${outputPath}/${style.soaStruct}.h`;

  if (!existsSync(outputPath)) {
    mkdirSync(outputPath);
  }

  writeFileSync(headerFilePath, headerFileContent);
  console.log(chalk.bold.green(`✔ Successfully generated ${headerFilePath}`));
}
