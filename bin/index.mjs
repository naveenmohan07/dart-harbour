#!/usr/bin/env node

import * as cmdr from 'commander';
import { checkFlutter } from './project.mjs';
import { createPacakges } from './shared.mjs';
import { selectPackage } from './dependency.mjs';


cmdr.program.command('flutter-snap').description('Creates custom flutter project').action(() => {
    checkFlutter();
})

cmdr.program.command('fast-fuse').description('Install dependency for existing packages').action(() => {
    selectPackage();
})

cmdr.program.command('packify').description('Creates custom package for existing project').action(() => {
    createPacakges();
})

cmdr.program.parse(process.argv);