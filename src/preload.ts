// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from "electron";
import fs from 'fs';
import { exec } from 'child_process';
console.log('preload');

contextBridge.exposeInMainWorld('nodeFunctions', {
    readFileSync: fs.readFileSync,
    readFile: fs.readFile,
    writeFileSync: fs.writeFileSync,
    exec: exec
});