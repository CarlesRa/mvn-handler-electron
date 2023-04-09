import {initTable, getTableData, getDestinationPath, setDestinationFolder} from './table.helper';
import {showNoRowsMessage} from './alerts.helper';
import {executeCommand} from "./terminal.helper";
import {ApplicationData} from "../models/application-data.model";
import {spinnerHandler} from "../services/app-message.service";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const nodeFunctions = window['nodeFunctions'];

window.onload = () => {
  initEvents();
  getInitialData();
}

const initEvents = (): void =>  {
  document.querySelector('#saveBtn').addEventListener('click', () => { saveData(); });
  document.querySelector('#generateWars').addEventListener('click', () => {
    generateWars()
  });
  document.querySelector('#copyToTomcat').addEventListener('click', () => {
    copyToTomcat();
  });
}

const getInitialData = (): void =>  {
  nodeFunctions.readFile('config.json', 'utf8', (err: any, data: any) => {
    if (err) {
      alert('Error reading paths data, Restart the application, or save new data');
      return;
    }
    const applicationData: ApplicationData = JSON.parse(data);
    initTable(applicationData.tableRows);
    setDestinationFolder(applicationData.destinationPath);
  });
}

const saveData = (): void =>  {
  spinnerHandler.next();
  const tableData = getTableData();
  if (tableData.length === 0) {
    showNoRowsMessage();
    return;
  }
  const destinationPath = getDestinationPath();
  const applicationData =  new ApplicationData(destinationPath, tableData);
  nodeFunctions.writeFileSync(
    'config.json', JSON.stringify(applicationData), () => alert('Error saving data, please try again')
  );
}

const generateWars = (): void =>  {
  if (getTableData().length === 0) {
    showNoRowsMessage();
    return;
  }
  executeCommand('ls > /home/carlesra/Documents/test.txt') // TODO: add correct command
    .then(() => alert('ok'))
    .catch((error) => console.log(error));
}

const copyToTomcat = (): void => {
  const destinationPath: HTMLInputElement = document.querySelector('#destinationPath');
  if (!destinationPath.value) {
    alert('No destination Path saved');
    return;
  }
  executeCommand('cp ./config.json /home/carlesra/Documents/') // TODO: add correct command
    .then(() => alert('ok'))
    .catch((error) => console.log(error));
}