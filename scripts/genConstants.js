#!/usr/bin/env node
const package = require(`${__dirname}/../package.json`);
const today = new Date();
console.log(
  [
    `const AUTHOR: string = '${package.author}';`,
    `const DESCRIPTION: string = '${package.description}';`,
    `const HOMEPAGE: string = '${package.homepage}';`,
    `const LICENSE: string = '${package.license}';`,
    `const NAME: string = '${package.name}';`,
    `const RELEASED_DATE: string = '${today.toUTCString()}';`,
    `const RELEASED_YEAR: number = ${today.getUTCFullYear()};`,
    `const VERSION: string = '${package.version}';`,
    '',
    'export const Constants = {',
    '  AUTHOR,',
    '  DESCRIPTION,',
    '  HOMEPAGE,',
    '  LICENSE,',
    '  NAME,',
    '  RELEASED_DATE,',
    '  RELEASED_YEAR,',
    '  VERSION',
    '};'
  ].join('\n')
);
