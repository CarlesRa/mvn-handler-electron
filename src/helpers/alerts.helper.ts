
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mainProcess = window['mainProcess'];

export const showDataCantSaved = () => {
  showMessage('Data not saved, complete all form fields');
}

export const showDataSavedCorrectly = () => {
  showMessage('Data has been saved correctly!');
}

export const showReleaseEmpty = () => {
  showMessage('the release field cannot be empty.');
}

export const showReleaseRemoved = () => {
  showMessage('Release removed correctly!');
}

export const showNoTableRows = () => {
  showMessage('Error, No rows in table');
}

export const showErrorCreatingWar = (message: string) => {
  showMessage(`Error creating WARs: ${message}`);
}

export const errorCopyingWar = (message: string) => {
  showMessage(`Error copying WARs: ${message}`);
}

export const errorCantAddRow = () => {
  showMessage('The row cannot be added, fill in the previous one first');
}

export const errorSavingData = () => {
  showMessage('Error saving data, please try again');
}

export const noDestinationPath = () => {
  showMessage('No destination Path saved');
}

const showMessage = (message: string): void => {
  mainProcess.renderer.invoke('showDialog', message);
}