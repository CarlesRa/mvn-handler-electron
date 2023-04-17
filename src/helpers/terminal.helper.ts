// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mainProcess = window['mainProcess'];

export const executeCommand = (command: string) => {
  return new Promise((resolve, reject) => {
    mainProcess.exec(`start cmd /c ${command}`, (error: (undefined | null), stdout: string, stderr: string) => {
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