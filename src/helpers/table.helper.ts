import {Row} from "../models/row.model";
import {spinnerHandler} from "../services/app-message.service";

// listeners
document.querySelector('#add').addEventListener('click', () => { addRow(); });

spinnerHandler.subscribe(() => {
  alert('rxjs is fine!!!');
});

export const initTable = (rows: Row[]) => {
  rows.forEach(row => addRow(row))
}

export const setDestinationFolder = (destinationFolder: string) => {
  const destinationFolderInput: HTMLInputElement = document.querySelector('#destinationPath')
  destinationFolderInput.value = destinationFolder;
}

const addRow = (tableRow?: Row, idTBody = 'rows'): void => {
  const tableData = getTableData();
  const lastRow = tableData[tableData.length - 1];
  if (lastRow && (lastRow.mvnDirectory === '' || lastRow.warDirectory === '')) {
    alert('The row cannot be added, fill in the previous one first');
    return;
  }
  const tBody = document.querySelector(`#${idTBody}`);
  const trElement = getTr();
  const mvnDirectoryInput = getDirectoryInput('MVN Directory');
  const warDirectoryInput = getDirectoryInput('WAR Directory');
  const tdAction = getTdAction();
  mvnDirectoryInput.querySelector('input').value = tableRow?.warDirectory ?? '';
  warDirectoryInput.querySelector('input').value = tableRow?.mvnDirectory ?? '';
  trElement.appendChild(mvnDirectoryInput);
  trElement.appendChild(warDirectoryInput);
  trElement.appendChild(tdAction);
  trElement.className = 'row-element';
  tBody.appendChild(trElement);
}

const getTr = (): HTMLTableRowElement => {
  return document.createElement('tr');
}

const getDirectoryInput = (placeHolder: string, value?: string): HTMLTableCellElement => {
  const tdDirectory = document.createElement('td');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control align-middle';
  input.placeholder = placeHolder;
  input.value = value ?? '';
  tdDirectory.appendChild(input);
  return tdDirectory;
}

const getTdAction = (): HTMLTableCellElement => {
  const tdAction = document.createElement('td');
  const tdI = document.createElement('i');
  tdI.className = 'bi bi-trash text-right pointer align-middle';
  tdI.addEventListener('click', (event) => removeRow(tdI));
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

export const getTableData = (): Row[] => {
  const rows = document.querySelectorAll('#rows tr');
  const tableData: Row[] = [];
  rows.forEach(row => {
    const columns = row.querySelectorAll('td');
    const rowData = new Row();
    rowData.mvnDirectory = columns[0].querySelector('input').value || '';
    rowData.warDirectory = columns[1].querySelector('input').value || '';
    tableData.push(rowData);
  });
  return tableData;
}

export const getDestinationPath = (): string => {
  const destinationPath: HTMLInputElement = document.querySelector('#destinationPath');
  return destinationPath.value;
}
