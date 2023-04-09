// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const nodeFunctions = window['nodeFunctions'];

export const executeCommand = (command: string) => {
  return new Promise((resolve, reject) => {
    nodeFunctions.exec(command, (error: (undefined | null), stdout: string, stderr: string) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        resolve(stderr);
        return;
      }
      resolve(stdout);
    });
  });
}