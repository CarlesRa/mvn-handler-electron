// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mainProcess = window['mainProcess'];

export const executeCommand = (cmdOption: string, command: string) => {
  return new Promise((resolve, reject) => {
    mainProcess.exec(`start cmd ${cmdOption}  ${command}`,
        (error: (undefined | null), stdout: string, stderr: string) => {
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