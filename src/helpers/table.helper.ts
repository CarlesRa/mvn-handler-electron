import {TableRow} from "../models/table-row.model";
import {spinnerHandler} from "../services/app-message.service";
import {applicationDataChanges} from "./data.helper";
import {ApplicationData} from "../models/application-data.model";
import {errorCantAddRow} from "./alerts.helper";

/*enum AcceptedInput {
  Folder,
  War,
}*/

type AcceptedInput = '.xml' | '.war';

window.onload = () => {
  initSubscriptions();
}

function initSubscriptions(): void {
  document.querySelector('#add').addEventListener('click', () => {
    addRow(null, 'rows', true);
    applicationDataChanges();
  });
  document.querySelector('#headerCheckbox').addEventListener('change', () => checkboxHeaderHandler());
  document.querySelector('#destinationPath').addEventListener('keyup', () =>
    applicationDataChanges());
  spinnerHandler.subscribe(() => { // TODO: test rxjs
    alert('rxjs is fine!!!');
  });
}

export const initTable = (rows: TableRow[]) => {
  const tBody = document.querySelector('tbody');
  tBody.innerHTML = '';
  rows.forEach(row => addRow(row, 'rows', row.active))
  if (rows.every(row => row.active)) {
    const checkboxHeader: HTMLInputElement = document.querySelector('#headerCheckbox');
    checkboxHeader.checked = true;
  }
  checkboxHandler(null);
}

export const setReleaseVersions = (applicationData: ApplicationData[]) => {
  const releaseSelect: HTMLSelectElement = document.querySelector('#releaseSelect');
  removeChildElements(releaseSelect);
  applicationData.forEach((data, index) => {
    const option: HTMLOptionElement = document.createElement('option');
    option.value = data.releaseVersion;
    option.textContent = data.releaseVersion;
    if (index === applicationData.length - 1) {
      option.defaultSelected = true;
    }
    releaseSelect.appendChild(option);
  });
}

export const setDestinationPathInput = (destinationFolder: string) => {
  const destinationFolderInput: HTMLInputElement = document.querySelector('#destinationPath')
  destinationFolderInput.value = destinationFolder;
}

const addRow = (tableRow?: TableRow, idTBody = 'rows', isCheckBoxActive = true): void => {
  const tableData = getTableData();
  const lastRow = tableData[tableData.length - 1];
  if (lastRow && (lastRow.pomPath === '' || lastRow.warPath === '')) {
    errorCantAddRow();
    return;
  }
  const tBody = document.querySelector(`#${idTBody}`);
  const trElement = document.createElement('tr');
  const checkbox = getCheckbox();
  const pomFileInput = getTdInputWithIcon('POM Folder', '.xml');
  const warFileInput = getTdInputWithIcon('WAR Path', '.war');
  const newWarName = getTdInput('Change war name');
  const tdAction = getTdAction();
  trElement.addEventListener('click', () => applicationDataChanges());
  checkbox.querySelector('input').checked = isCheckBoxActive;
  pomFileInput.querySelector('input').value = tableRow?.pomPath ?? '';
  warFileInput.querySelector('input').value = tableRow?.warPath ?? '';
  newWarName.querySelector('input').value = tableRow?.newWarName ?? '';
  trElement.appendChild(checkbox);
  trElement.appendChild(pomFileInput);
  trElement.appendChild(warFileInput);
  trElement.appendChild(newWarName);
  trElement.appendChild(tdAction);
  trElement.className = 'row-element';
  tBody.appendChild(trElement);
}

const getCheckbox = (): HTMLTableCellElement => {
  const tdCheckbox = document.createElement('td');
  tdCheckbox.style.width = '5%';
  tdCheckbox.style.textAlign = 'center';
  tdCheckbox.className = 'align-middle';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'form-check-input align-middle';
  input.checked = true;
  input.addEventListener('click', () => checkboxHandler(input));
  tdCheckbox.appendChild(input);
  return tdCheckbox;
}

const checkboxHandler = (checkbox: HTMLInputElement) => {
  const headerCheckbox: HTMLInputElement = document.querySelector('#headerCheckbox');
  if (checkbox && !checkbox.checked) {
    headerCheckbox.checked = false;
    return;
  }
  const allCheckboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[type="checkbox"]')
  const checkBoxArray = Array.from(allCheckboxes);
  checkBoxArray.shift();
  if (checkBoxArray.filter(checkbox => checkbox.checked).length === getTableData().length) {
    headerCheckbox.checked = true;
    return;
  }
  headerCheckbox.checked = false;
}

const getTdInputWithIcon = (placeHolder: string, acceptedInput: AcceptedInput): HTMLTableCellElement => {
  const td = document.createElement('td');
  const div = document.createElement('div');
  const input = getInput(placeHolder);
  const button = document.createElement('button');
  const span = document.createElement('span');
  const i = document.createElement('i');
  td.className = 'align-middle';
  div.className = 'input-group';
  button.className = 'btn btn-primary btn-sm input-group-text';
  button.title = 'Click to search';
  span.className = 'bi bi-search';
  div.appendChild(input);
  button.appendChild(span);
  div.appendChild(button);
  td.appendChild(div);
  button.addEventListener('click', () => inputFileHandler(input, acceptedInput))
  return td;
}

const getTdInput = (placeHolder: string) => {
  const td = document.createElement('td');
  const input = getInput(placeHolder);
  input.title = 'Insert a value if you want to change the name of the war';
  td.className = 'align-middle';
  td.appendChild(input);
  return td;
}

const getInput = (placeHolder: string): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control align-middle';
  input.placeholder = placeHolder;
  return input;
}

const getTdAction = (): HTMLTableCellElement => {
  const td = document.createElement('td');
  const i = document.createElement('i');
  td.className = 'align-middle';
  i.className = 'bi bi-trash text-right pointer align-middle';
  i.title = 'Remove row';
  i.addEventListener('click', () => removeRow(i));
  td.style.textAlign = 'right';
  td.appendChild(i);
  return td;
}

const removeRow = (tdI: HTMLElement): void => {
  const td = tdI.parentElement;
  const tr = td.parentElement;
  const tBody = tr.parentElement;
  tBody.removeChild(tr);
}

const checkboxHeaderHandler = () => {
  const checkboxHeader: HTMLInputElement = document.querySelector('#headerCheckbox');
  const allCheckboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[type="checkbox"]')
  allCheckboxes.forEach(checkbox => checkbox.checked = checkboxHeader.checked);
}

const inputFileHandler = (inputElement: HTMLInputElement, accept: AcceptedInput) => {
  const input = document.createElement('input');
  let inputValue: string;
  input.type = 'file';
  input.accept = accept;
  input.addEventListener('change', (event) => {
    const inputResult = event.target as HTMLInputElement;
    if (accept === '.xml') {
      const resultArray: string[] = inputResult.files[0].path.split('\\');
      resultArray.pop();
      inputValue = resultArray.join('\\');
    } else {
      inputValue = inputResult.files[0].path;
    }
    inputElement.value = inputValue;
  });
  input.click();
}

export const getTableData = (): TableRow[] => {
  const rows = document.querySelectorAll('#rows tr');
  const tableData: TableRow[] = [];
  rows.forEach(row => {
    const columns = row.querySelectorAll('td');
    const rowData = new TableRow();
    rowData.active =  columns[0].querySelector('input').checked || false;
    rowData.pomPath = columns[1].querySelector('input').value || '';
    rowData.warPath = columns[2].querySelector('input').value || '';
    rowData.newWarName = columns[3].querySelector('input').value || '';
    tableData.push(rowData);
  });
  return tableData;
}

const removeChildElements = (element: HTMLElement) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
