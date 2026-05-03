import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = process.argv[2];
if (!sourcePath) {
  throw new Error("Usage: node tools/inspect-wrapup-workbook.mjs <workbook.xlsx>");
}

const qaDir = new URL("../.qa/wrapup-source/", import.meta.url);
await fs.mkdir(qaDir, { recursive: true });

const input = await FileBlob.load(sourcePath);
const workbook = await SpreadsheetFile.importXlsx(input);

const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 8,
  tableMaxCols: 10,
  tableMaxCellChars: 120,
});

await fs.writeFile(new URL("overview.ndjson", qaDir), overview.ndjson);
console.log(overview.ndjson);

for (const sheet of workbook.worksheets.items) {
  const safeName = sheet.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  const region = await workbook.inspect({
    kind: "region",
    sheetId: sheet.name,
    range: "A1:Z80",
    maxChars: 10000,
    tableMaxRows: 24,
    tableMaxCols: 14,
    tableMaxCellChars: 160,
  });
  await fs.writeFile(new URL(`${safeName || "sheet"}.ndjson`, qaDir), region.ndjson);

  const preview = await workbook.render({
    sheetName: sheet.name,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(new URL(`${safeName || "sheet"}.png`, qaDir), new Uint8Array(await preview.arrayBuffer()));
}
