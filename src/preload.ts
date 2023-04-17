// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import {contextBridge, ipcRenderer, dialog} from "electron";

console.log('preload');

ipcRenderer.invoke('get-user-data').then(data => {
    contextBridge.exposeInMainWorld('mainProcess', {
        readFileSync: fs.readFileSync,
        readFile: fs.readFile,
        writeFileSync: fs.writeFileSync,
        exec: exec,
        path: path,
        baseDir: data,
        dialogElectron: dialog,
        renderer: ipcRenderer,
    });
});
