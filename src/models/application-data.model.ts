import {TableRow} from "./table-row.model";

export class ApplicationData {
  releaseVersion: string;
  destinationPath: string;
  tableRows: TableRow[];

  constructor(releaseVersion: string, destinationPath: string, tableRows: TableRow[]) {
    this.releaseVersion = releaseVersion;
    this.destinationPath = destinationPath;
    this.tableRows = tableRows;
  }
}