import {initTable, getTableData, getDestinationPath, setDestinationPathInput} from './table.helper';
import {showNoRowsMessage} from './alerts.helper';
import {executeCommand} from "./terminal.helper";
import {ApplicationData} from "../models/application-data.model";
import {TableRow} from "../models/table-row.model";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const nodeFunctions = window['nodeFunctions'];
let initialData: ApplicationData;

const initEvents = (): void =>  {
  document.querySelector('#saveBtn').addEventListener('click', () => { saveData(); });
  document.querySelector('#generateWars').addEventListener('click', () => {
    generateWars()
  });
  document.querySelector('#copyToTomcat').addEventListener('click', () => {
    copyToTomcat();
  });
}

export const setInitialData = (): void =>  {
  getInitialData().then((data: ApplicationData) => {
    if (!data) { return; }
    initialData = data;
    initTable(data.tableRows);
    setDestinationPathInput((data.destinationPath));
  });
}

export const getInitialData = (): Promise<ApplicationData> => {
  const configFilePath = nodeFunctions.path.join(nodeFunctions.baseDir, 'config.json');
  return new Promise((resolve) => {
    nodeFunctions.readFile(configFilePath, 'utf8', (err: any, data: any) => {
      if (data) {
        const applicationData: ApplicationData = JSON.parse(data);
        resolve(applicationData);
        return;
      }
      resolve(null);
    });
  })
}

const saveData = (): void =>  {
  const tableData = getTableData();
  if (tableData.length === 0) {
    showNoRowsMessage();
    return;
  }
  const destinationPath = getDestinationPath();
  const applicationData =  new ApplicationData(destinationPath, tableData);
  const configFilePath = nodeFunctions.path.join(nodeFunctions.baseDir, 'config.json');
  nodeFunctions.writeFileSync(
    configFilePath, JSON.stringify(applicationData), () => alert('Error saving data, please try again')
  );
  alert('Data has been saved correctly!');
  setBtnSaveClass('btn btn-success w-100')
}

const generateWars = (): void =>  {
  const tableData = getTableData().filter(row => row.warPath !== '' && row.mvnPath !== '' && row.active);
  if (tableData.length === 0) {
    showNoRowsMessage();
    return;
  }
  executeCommand('ls > /home/carlesra/Documents/test.txt') // TODO: add correct command
    .then(() => alert('ok'))
    .catch((error) => console.log(error));
}

const copyToTomcat = (): void => {
  const destinationPath: HTMLInputElement = document.querySelector('#destinationPath');
  const tableData = getTableData().filter(row => row.warPath !== '' && row.mvnPath !== '' && row.active);

  if (!destinationPath.value) {
    alert('No destination Path saved');
    return;
  }
  if (tableData.length === 0) {
    showNoRowsMessage();
    return;
  }
  executeCommand('cp ./config.json /home/carlesra/Documents/') // TODO: add correct command
    .then(() => alert('ok'))
    .catch((error) => console.log(error));
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
  const initialTableRows: TableRow[] = initialData.tableRows;
  let sameData = true;
  if (tableData.length !== initialTableRows.length) {
    sameData = false;
    return;
  }
  tableData.forEach((row, index) => {
    if (
      row.active !== initialTableRows[index].active ||
      row.mvnPath !== initialTableRows[index].mvnPath ||
      row.warPath !== initialTableRows[index].warPath) {
      sameData = false;
      return;
    }
  });
  const destinationPath: HTMLInputElement = document.querySelector('#destinationPath');
  if (destinationPath.value !== initialData.destinationPath) {
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