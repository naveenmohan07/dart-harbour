#!/usr/bin/env node

import * as cmdr from 'commander';
import { checkFlutter } from './project.mjs';
import { createPacakges } from './shared.mjs';
import { processDependency } from './dependency.mjs';
import { APP_CONSTANT } from './constants/app.contant.mjs';


cmdr.program.command('flutter-snap').description('Creates custom flutter project').action(() => {
    checkFlutter();
})

cmdr.program.command('fast-fuse').description('Install dependency for existing packages').action(() => {
    processDependency(APP_CONSTANT.DEPENDENCY_OPERATION.INSTALL);
})

cmdr.program.command('packify').description('Creates custom package for existing project').action(() => {
    createPacakges();
})

cmdr.program.command('fast-purge').description('Remove dependency for existing packages').action(() => {
    processDependency(APP_CONSTANT.DEPENDENCY_OPERATION.REMOVE);
})

cmdr.program.parse(process.argv);