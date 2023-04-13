import {TableRow} from "./table-row.model";

export class ApplicationData {
  releaseVersion: string;
  destinationPath: string;
  tableRows: TableRow[];

  constructor(destinationPath: string, tableRows: TableRow[]) {
    this.destinationPath = destinationPath;
    this.tableRows = tableRows;
  }
}