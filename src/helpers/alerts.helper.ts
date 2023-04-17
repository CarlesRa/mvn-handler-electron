
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const nodeFunctions = window['nodeFunctions'];

export const showDataCantSaved = () => {
  nodeFunctions.renderer.invoke('showDialog', 'Data not saved, complete all form fields');
}

export const showDataSavedCorrectly = () => {
  nodeFunctions.renderer.invoke('showDialog', 'Data has been saved correctly!');
}

export const showReleaseEmpty = () => {
  nodeFunctions.renderer.invoke('showDialog', 'the release field cannot be empty.');
}

export const showReleaseRemoved = () => {
  nodeFunctions.renderer.invoke('showDialog', 'Release removed correctly!');
}