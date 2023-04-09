import {Row} from "./row.model";

export class ApplicationData {
  destinationPath: string;
  tableRows: Row[];

  constructor(destinationPath: string, tableRows: Row[]) {
    this.destinationPath = destinationPath;
    this.tableRows = tableRows;
  }
}