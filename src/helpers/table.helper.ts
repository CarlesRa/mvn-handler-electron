import {TableRow} from "../models/table-row.model";
import {spinnerHandler} from "../services/app-message.service";
import {applicationDataChanges} from "./data.helper";


// listeners
document.querySelector('#add').addEventListener('click', () => addRow());
document.querySelector('#headerCheckbox').addEventListener('change', () => checkboxHeaderHandler());
document.querySelector('#destinationPath').addEventListener('change', () =>
  applicationDataChanges());

spinnerHandler.subscribe(() => { // TODO: test rxjs
  alert('rxjs is fine!!!');
});

export const initTable = (rows: TableRow[]) => {
  rows.forEach(row => addRow(row))
  if (rows.every(row => row.active)) {
    const checkboxHeader: HTMLInputElement = document.querySelector('#headerCheckbox');
    checkboxHeader.checked = true;
  }
}

export const setDestinationPathInput = (destinationFolder: string) => {
  const destinationFolderInput: HTMLInputElement = document.querySelector('#destinationPath')
  destinationFolderInput.value = destinationFolder;
}

const addRow = (tableRow?: TableRow, idTBody = 'rows'): void => {
  const tableData = getTableData();
  const lastRow = tableData[tableData.length - 1];
  if (lastRow && (lastRow.mvnPath === '' || lastRow.warPath === '')) {
    alert('The row cannot be added, fill in the previous one first');
    return;
  }
  const tBody = document.querySelector(`#${idTBody}`);
  const trElement = getTr();
  const checkbox = getCheckbox();
  const mvnPathInput = getPathInput('MVN Path');
  const warPathInput = getPathInput('WAR Path');
  const tdAction = getTdAction();
  trElement.addEventListener('click', () => applicationDataChanges());
  checkbox.querySelector('input').checked = tableRow?.active ?? false;
  mvnPathInput.querySelector('input').value = tableRow?.mvnPath ?? '';
  warPathInput.querySelector('input').value = tableRow?.warPath ?? '';
  trElement.appendChild(checkbox);
  trElement.appendChild(mvnPathInput);
  trElement.appendChild(warPathInput);
  trElement.appendChild(tdAction);
  trElement.className = 'row-element';
  tBody.appendChild(trElement);
}

const getTr = (): HTMLTableRowElement => {
  return document.createElement('tr');
}

const getCheckbox = (): HTMLTableCellElement => {
  const tdCheckbox = document.createElement('td');
  tdCheckbox.style.width = '5%';
  tdCheckbox.style.textAlign = 'center';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'form-check-input align-middle';
  input.addEventListener('click', () => checkBoxPressed(input));
  tdCheckbox.appendChild(input);
  return tdCheckbox;
}

const checkBoxPressed = (checkbox: HTMLInputElement) => {
  const headerCheckbox: HTMLInputElement = document.querySelector('#headerCheckbox');
  if (!checkbox.checked) {
    headerCheckbox.checked = false;
    return;
  }
  const allCheckboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[type="checkbox"]')
  const checkBoxArray = Array.from(allCheckboxes);
  if (checkBoxArray.filter(checkbox => checkbox.checked).length === getTableData().length) {
    headerCheckbox.checked = true;
  }
}

const getPathInput = (placeHolder: string, value?: string): HTMLTableCellElement => {
  const tdPath = document.createElement('td');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control align-middle';
  input.placeholder = placeHolder;
  input.value = value ?? '';
  tdPath.appendChild(input);
  return tdPath;
}

const getTdAction = (): HTMLTableCellElement => {
  const tdAction = document.createElement('td');
  const tdI = document.createElement('i');
  tdI.className = 'bi bi-trash text-right pointer align-middle';
  tdI.addEventListener('click', () => removeRow(tdI));
  tdAction.style.textAlign = 'right';
  tdAction.appendChild(tdI);
  return tdAction;
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

export const getTableData = (): TableRow[] => {
  const rows = document.querySelectorAll('#rows tr');
  const tableData: TableRow[] = [];
  rows.forEach(row => {
    const columns = row.querySelectorAll('td');
    const rowData = new TableRow();
    rowData.active =  columns[0].querySelector('input').checked || false;
    rowData.mvnPath = columns[1].querySelector('input').value || '';
    rowData.warPath = columns[2].querySelector('input').value || '';
    tableData.push(rowData);
  });
  return tableData;
}

export const getDestinationPath = (): string => {
  const destinationPath: HTMLInputElement = document.querySelector('#destinationPath');
  return destinationPath.value;
}
