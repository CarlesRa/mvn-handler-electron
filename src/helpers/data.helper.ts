import {initTable, getTableData, setDestinationPathInput, setReleaseVersions} from './table.helper';
import {
  errorCopyingWar,
  showErrorCreatingWar, errorSavingData,
  noDestinationPath,
  showDataCantSaved,
  showDataSavedCorrectly,
  showNoTableRows,
  showReleaseEmpty,
  showReleaseRemoved
} from './alerts.helper';
import {executeCommand} from "./terminal.helper";
import {ApplicationData} from "../models/application-data.model";
import {TableRow} from "../models/table-row.model";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mainProcess = window['mainProcess'];
let initialData: ApplicationData[];

const initEvents = (): void =>  {
  document.querySelector('#saveBtn').addEventListener('click', () => { saveRelease(); });
  document.querySelector('#generateWars').addEventListener('click', () => {
    generateWars().then();
  });
  document.querySelector('#copyToTomcat').addEventListener('click', () => {
    copyToTomcat().then();
  });
  document.querySelector('#newReleaseBtn').addEventListener('click', () => openReleaseModal())
  document.querySelector('#saveReleaseVersion').addEventListener('click', () => newRelease());
  document.querySelector('#releaseSelect').addEventListener('change', () => releaseVersionChange());
  document.querySelector('#deleteBtn').addEventListener('click', () => deleteRelease());
}

export const setInitialData = (): void =>  {
  getInitialData().then((data: ApplicationData[]) => {
    initialData = data ?? [];
    if (!initialData || initialData.length === 0) { return; }
    setReleaseVersions(data);
    initTable(data[data.length - 1].tableRows);
    setDestinationPathInput((data[data.length -1].destinationPath));
  });
}

export const getInitialData = (): Promise<ApplicationData[]> => {
  const configFilePath = mainProcess.path.join(mainProcess.baseDir, 'config.json');
  return new Promise((resolve) => {
    mainProcess.readFile(configFilePath, 'utf8', (err: any, data: any) => {
      if (data) {
        const applicationData: ApplicationData[] = JSON.parse(data);
        resolve(applicationData);
        return;
      }
      resolve([]);
    });
  });
}

const openReleaseModal = () => {
  const dialog: any = document.querySelector('#newReleaseDialog');
  dialog.showModal();
}

const newRelease = () => {
  const releaseInput: HTMLInputElement = document.querySelector('#releaseInput');
  if (!releaseInput.value) {
    showReleaseEmpty();
    return;
  }
  const dialog: any = document.querySelector('#newReleaseDialog');
  const appData = new ApplicationData(releaseInput.value, '', [])
  initialData.push(appData);
  setReleaseVersions(initialData);
  initTable(appData.tableRows);
  dialog.close();
}

const releaseVersionChange = () => {
  const releaseSelect: HTMLSelectElement = document.querySelector('#releaseSelect');
  const releaseSelectedData = initialData.find(data =>
      data.releaseVersion === releaseSelect.value);
  if (releaseSelectedData) {
    getDestinationPath().value = releaseSelectedData.destinationPath;
    initTable(releaseSelectedData.tableRows);
  }
}

const saveRelease = (): void =>  {
  const tableData: TableRow[] = getTableData();
  const releaseVersion: HTMLSelectElement = getReleaseVersion();
  const destinationPath: HTMLInputElement = getDestinationPath();
  if (tableData.length === 0 || !releaseVersion || releaseVersion.value === ''
    || !destinationPath.value || destinationPath.value === '') {
    showDataCantSaved();
    return;
  }
  const index: number = initialData.findIndex(data => data.releaseVersion === getReleaseVersion().value);
  if (index === -1) { return; }
  initialData[index].tableRows = tableData;
  initialData[index].destinationPath = destinationPath.value;
  persistChanges(initialData);
  setBtnSaveClass('btn btn-success w-100');
  showDataSavedCorrectly();
}

const deleteRelease = () => {
  const index = initialData.findIndex(data => data.releaseVersion === getReleaseVersion().value);
  if (index === -1) { return; }
  initialData.splice(index, 1);
  getReleaseVersion().value = '';
  getDestinationPath().value = '';
  persistChanges(initialData);
  const tBody = document.querySelector('tbody');
  tBody.innerHTML = '';
  showReleaseRemoved();
  setInitialData();
}

const persistChanges = (applicationData: ApplicationData[]): void => {
  const configFilePath = mainProcess.path.join(mainProcess.baseDir, 'config.json');
  mainProcess.writeFileSync(configFilePath, JSON.stringify(applicationData), () => errorSavingData());
}

const getDestinationPath = (): HTMLInputElement => {
  const destinationPath: HTMLInputElement = document.querySelector('#destinationPath');
  return destinationPath;
}

export const getReleaseVersion = (): HTMLSelectElement => {
  const releaseSelect: HTMLSelectElement = document.querySelector('#releaseSelect');
  return releaseSelect;
}

const generateWars = async (): Promise<void> =>  {
  const tableData: TableRow[] = getTableData().filter((row: TableRow) =>
      row.warPath !== '' && row.pomPath !== '' && row.active);
  if (tableData.length === 0) {
    showNoTableRows();
    return;
  }
  for(const row of tableData) {
    let errorOnGenerateWar = false;
    await executeCommand('/k', `mvn -f ${row.pomPath} clean package install`)
      .catch((error) => {
        showErrorCreatingWar(error);
        errorOnGenerateWar = true;
      });
    if (errorOnGenerateWar) { return; }
  }
}

const copyToTomcat = async (): Promise<void> => {
  const tableData: TableRow[] = getTableData().filter(row =>
      row.warPath !== '' && row.pomPath !== '' && row.active);
  if (tableData.length === 0) {
    showNoTableRows();
    return;
  }
  const destinationPath: HTMLInputElement = document.querySelector('#destinationPath');
  if (!destinationPath.value) {
    noDestinationPath();
    return;
  }
  for(const row of tableData) {
    let errorOnGenerateWar = false;
    const warPath = mainProcess.path.join(destinationPath.value, row.newWarName);
    await executeCommand('/c',`xcopy /F /I /Y  ${row.warPath} ${warPath}`)
      .catch((error) => {
        errorCopyingWar(error);
        errorOnGenerateWar = true;
      });
    if (errorOnGenerateWar) { return; }
  }
}

export const applicationDataChanges = () => {
  if (!initialData) { return; }

  if (isApplicationDataModified()) {
    setBtnSaveClass('btn btn-success w-100');
    return;
  }
  setBtnSaveClass('btn btn-danger w-100');
}

const isApplicationDataModified = (): boolean => {
  const tableData: TableRow[] = getTableData();
  const selectedVersion = initialData.find(data =>
      data.releaseVersion === getReleaseVersion().value);
  const selectedTableRows: TableRow[] = selectedVersion.tableRows;
  let sameData = true;
  if (tableData.length !== selectedTableRows.length) {
    sameData = false;
    return;
  }
  tableData.forEach((row, index) => {
    if (
      row.active !== selectedTableRows[index].active ||
      row.pomPath !== selectedTableRows[index].pomPath ||
      row.warPath !== selectedTableRows[index].warPath ||
      row.newWarName !== selectedTableRows[index].newWarName) {
      sameData = false;
      return;
    }
  });
  const destinationPath: HTMLInputElement = document.querySelector('#destinationPath');
  if (destinationPath.value !== selectedVersion.destinationPath) {
    sameData = false;
  }
  return sameData;
}

const setBtnSaveClass = (cssClasses: string) => {
  const btnSaveApplicationData = document.querySelector('#saveBtn');
  btnSaveApplicationData.className = cssClasses;
}

initEvents();
setInitialData();