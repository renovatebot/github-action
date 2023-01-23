import * as core from '@actions/core';
import Docker from './docker';
import { Input } from './input';

const input = new Input();
const docker = new Docker(input);
core.setOutput('version', docker.version());
