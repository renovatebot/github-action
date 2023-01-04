import * as core from '@actions/core';
import { Input } from './input';
import Docker from './docker';

const input = new Input();
const docker = new Docker(input);
core.setOutput('version', docker.version());
