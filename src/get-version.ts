import * as core from '@actions/core';
import Docker from './docker';

core.setOutput('version', Docker.version());
