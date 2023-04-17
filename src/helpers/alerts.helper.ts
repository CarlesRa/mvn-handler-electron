
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const nodeFunctions = window['nodeFunctions'];

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

export const errorCreatingWar = (message: string) => {
  showMessage(`Error creating WARs in ${message}`);
}

export const errorCantAddRow = () => {
  showMessage('The row cannot be added, fill in the previous one first');
}

export const errorSavingData = () => {
  showMessage('Error saving data, please try again');
}

const showMessage = (message: string): void => {
  nodeFunctions.renderer.invoke('showDialog', message);
}