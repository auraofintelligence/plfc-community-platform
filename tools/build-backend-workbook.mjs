import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = new URL("../", import.meta.url);
const templatesDir = new URL("templates/", root);
const qaDir = new URL(".qa/backend-workbook/", root);

await fs.mkdir(templatesDir, { recursive: true });
await fs.mkdir(qaDir, { recursive: true });

const workbook = Workbook.create();

const colours = {
  ink: "#102234",
  ocean: "#047FA8",
  deepOcean: "#07445F",
  emerald: "#08B98B",
  gold: "#D69B1F",
  purple: "#7251B5",
  sand: "#FBF7EA",
  shell: "#FFFDF7",
  titanium: "#5F6D75",
};

function addSheet(name) {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridLines = false;
  return sheet;
}

function title(sheet, range, text, subtitle = "") {
  const titleRange = sheet.getRange(range);
  titleRange.merge();
  titleRange.values = [[text]];
  titleRange.format = {
    fill: colours.deepOcean,
    font: { bold: true, color: "#FFFFFF" },
  };
  if (subtitle) {
    const row = Number(range.match(/\d+/)?.[0] || 1) + 1;
    const endCol = range.match(/:([A-Z]+)\d+/)?.[1] || "H";
    const subtitleRange = sheet.getRange(`A${row}:${endCol}${row}`);
    subtitleRange.merge();
    subtitleRange.values = [[subtitle]];
    subtitleRange.format = {
      fill: colours.sand,
      font: { color: colours.ink, italic: true },
      wrapText: true,
    };
  }
}

function writeTable(sheet, startCell, headers, rows, tableName) {
  const startCol = startCell.match(/[A-Z]+/)?.[0] || "A";
  const startRow = Number(startCell.match(/\d+/)?.[0] || 1);
  const endCol = String.fromCharCode(startCol.charCodeAt(0) + headers.length - 1);
  const endRow = startRow + rows.length;
  const range = `${startCell}:${endCol}${endRow}`;
  sheet.getRange(range).values = [headers, ...rows];
  sheet.getRange(`${startCell}:${endCol}${startRow}`).format = {
    fill: colours.ocean,
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
  };
  sheet.tables.add(range, true, tableName);
  sheet.freezePanes.freezeRows(startRow);
  return { range, endRow };
}

const dashboard = addSheet("Dashboard");
title(
  dashboard,
  "A1:H1",
  "PLFC Backend Starter Workbook",
  "Template workbook for Google Sheets import: private source ledgers feed approved public-safe exports."
);
dashboard.getRange("A4:B10").values = [
  ["Metric", "Sample value"],
  ["Active members", 6],
  ["Open actions", 5],
  ["Media items pending review", 11],
  ["Payments awaiting reconciliation", 2],
  ["Upcoming calendar items", 4],
  ["Public exports ready", 3],
];
dashboard.getRange("A4:B4").format = { fill: colours.ocean, font: { bold: true, color: "#FFFFFF" } };
dashboard.getRange("A5:A10").format = { font: { bold: true, color: colours.deepOcean } };
dashboard.getRange("B5:B10").format = { fill: "#EAF9F5", font: { bold: true, color: colours.ink } };
dashboard.getRange("D4:F10").values = [
  ["Backend lane", "Owner", "Promptness"],
  ["Member data", "Secretary", "Daily"],
  ["Payments", "Treasurer", "Daily"],
  ["Field ops", "Field lead", "Immediate"],
  ["Media permissions", "Media lead", "After review"],
  ["Meetings", "Secretary", "Weekly"],
  ["Public exports", "Secretary", "After approval"],
];
dashboard.getRange("D4:F4").format = { fill: colours.purple, font: { bold: true, color: "#FFFFFF" } };
dashboard.getRange("A12:H16").values = [
  ["Operating rule", "Raw data goes into Drive or Sheets privately. Public pages consume approved summaries only.", "", "", "", "", "", ""],
  ["Calendar rule", "Create real Google Calendar events only after a committee-approved event type and owner are clear.", "", "", "", "", "", ""],
  ["Location rule", "No precise public GPS. Use broad after-the-event zones and consent status.", "", "", "", "", "", ""],
  ["Media rule", "Uploads stay private until permission status is reviewed.", "", "", "", "", "", ""],
  ["Audit rule", "Each export records source, timestamp, reviewer and public/private status.", "", "", "", "", "", ""],
];
dashboard.getRange("A12:H16").format = { fill: colours.shell, wrapText: true };
for (let row = 12; row <= 16; row += 1) {
  dashboard.getRange(`B${row}:H${row}`).merge();
}
dashboard.getRange("A12:A16").format = { fill: colours.sand, font: { bold: true, color: colours.deepOcean }, wrapText: true };
dashboard.getRange("B12:H16").format = { fill: colours.shell, wrapText: true };

const members = addSheet("Members");
title(members, "A1:H1", "Members Ledger", "Private source sheet. Do not publish raw member data.");
writeTable(
  members,
  "A4",
  ["Member ID", "Name", "Member Type", "Status", "Joined", "Expiry", "Newsletter", "SMS Consent", "Notes"],
  [
    ["M-0001", "Example Adult Member", "Adult Annual", "Active", "2026-04-01", "2027-03-31", "Yes", "Yes", "Sample only"],
    ["M-0002", "Example Social Member", "Social", "Active", "2026-04-02", "2027-03-31", "Yes", "No", "Sample only"],
    ["M-0003", "Example Junior Member", "Junior", "Pending guardian check", "2026-04-03", "2027-03-31", "Guardian", "No", "Sample only"],
  ],
  "MembersTable"
);

const events = addSheet("Events");
title(events, "A1:H1", "Events and Competitions", "Event planning register for calendar, field ops and public export decisions.");
writeTable(
  events,
  "A4",
  ["Event ID", "Title", "Type", "Start", "End", "Calendar Status", "Field Board", "Public Summary", "Owner"],
  [
    ["EV-001", "Sample Autumn Competition", "Competition", "2026-05-09 06:00", "2026-05-09 15:30", "Draft", "Yes", "After review", "Field lead"],
    ["EV-002", "Sample Working Bee", "Working bee", "2026-05-16 08:00", "2026-05-16 11:00", "Draft", "Optional", "Allowed", "Secretary"],
    ["EV-003", "Sample Committee Meeting", "Meeting", "2026-05-20 18:00", "2026-05-20 19:30", "Draft", "No", "Minutes only", "Secretary"],
  ],
  "EventsTable"
);

const payments = addSheet("Payments");
title(payments, "A1:H1", "Stripe and Payment Reconciliation", "Treasurer-facing ledger for matching Stripe, memberships and competition entries.");
writeTable(
  payments,
  "A4",
  ["Payment ID", "Date", "Payer", "Product", "Amount", "Stripe Status", "Member/Event Link", "Reconciled", "Notes"],
  [
    ["PAY-001", "2026-04-01", "Example Adult Member", "Adult Annual Membership", 75, "Paid", "M-0001", "Yes", "Sample only"],
    ["PAY-002", "2026-04-02", "Example Casual Entrant", "1-Comp Casual Membership", 25, "Paid", "EV-001", "No", "Needs member/event match"],
    ["PAY-003", "2026-04-03", "Example Sponsor", "Junior Fishing Education Sponsor", 100, "Paid", "Campaign", "No", "Check campaign tag"],
  ],
  "PaymentsTable"
);
payments.getRange("E5:E7").format.numberFormat = "$#,##0";

const permissions = addSheet("Permissions");
title(permissions, "A1:H1", "Permissions Register", "Tracks consent for SMS, media, member data use and location summaries.");
writeTable(
  permissions,
  "A4",
  ["Permission ID", "Person/Group", "Scope", "Status", "Granted On", "Expires", "Public Use", "Reviewer", "Notes"],
  [
    ["PER-001", "Example Team A", "Event-bound location summary", "Granted", "2026-05-09", "2026-05-09", "Broad summary only", "Secretary", "No precise GPS"],
    ["PER-002", "Example Member", "Photo use", "Pending", "", "", "No", "Media lead", "Awaiting review"],
    ["PER-003", "Example Sponsor", "Sponsor mention", "Granted", "2026-04-10", "2026-12-31", "Yes", "Committee", "Use approved wording"],
  ],
  "PermissionsTable"
);

const media = addSheet("MediaQueue");
title(media, "A1:H1", "Media Review Queue", "Private review queue before photos, videos or captions become public.");
writeTable(
  media,
  "A4",
  ["Media ID", "Event ID", "Type", "Storage Location", "Permission Status", "Public Status", "Caption Draft", "Reviewer", "Notes"],
  [
    ["MED-001", "EV-001", "Photo", "Drive/02 Competitions/sample", "Granted", "Ready", "Sample weigh-in photo", "Media lead", "Public-safe"],
    ["MED-002", "EV-001", "Video", "Drive/02 Competitions/sample", "Pending", "Private", "Sample beach clip", "Media lead", "Needs review"],
    ["MED-003", "EV-002", "Photo", "Drive/02 Field Ops/sample", "Granted", "Ready", "Sample working bee photo", "Secretary", "Grant evidence"],
  ],
  "MediaTable"
);

const field = addSheet("FieldOps");
title(field, "A1:H1", "Field Ops Snapshot", "Agent-export source for public-safe Field Ops JSON.");
writeTable(
  field,
  "A4",
  ["Snapshot ID", "Event ID", "Zone", "Tide Signal", "Weather Signal", "Team Summary", "Media Summary", "Privacy", "Export Ready"],
  [
    ["FS-001", "EV-001", "Point Lookout Headland", "Rising morning", "Wind watch", "4 checked in", "18 photos, 3 clips", "Broad zone only", "Yes"],
    ["FS-002", "EV-001", "South beach broad zone", "Afternoon bias", "UV high", "3 checked in", "9 photos", "Broad zone only", "Yes"],
    ["FS-003", "EV-002", "Amity / bay side", "Low tide note", "Good", "2 volunteers", "7 photos", "Public summary", "After review"],
  ],
  "FieldOpsTable"
);

const actions = addSheet("ActionRegister");
title(actions, "A1:H1", "Committee Action Register", "Meeting actions that carry forward until closed.");
writeTable(
  actions,
  "A4",
  ["Action ID", "Meeting/Event", "Owner", "Action", "Status", "Due Date", "Priority", "Next Check", "Notes"],
  [
    ["ACT-001", "Committee Meeting", "Secretary", "Confirm Drive folder rules", "Open", "2026-05-15", "High", "Next meeting", "Backend prerequisite"],
    ["ACT-002", "Committee Meeting", "Treasurer", "Confirm Stripe account ownership", "Open", "2026-05-18", "High", "Treasurer report", "Before live payments"],
    ["ACT-003", "Field Ops", "Field lead", "Approve broad map zones", "Open", "2026-05-20", "Medium", "Field ops review", "Privacy sensitive"],
  ],
  "ActionsTable"
);

const journey = addSheet("ClubJourney");
title(journey, "A1:I1", "Club Journey Context", "Public-safe summary of the wrap-up workbook. Keep raw source notes in Drive.");
writeTable(
  journey,
  "A4",
  ["Journey ID", "Phase", "Area", "Signal", "Status", "Constraint", "Website Use", "Backend Use", "Public Boundary"],
  [
    ["JNY-001", "Formation", "Governance", "Constitution, admin identity, banking and minutes are established.", "Existing", "Keep records findable", "Show legitimacy and continuity", "Store source docs in Drive", "Do not publish raw governance drafts"],
    ["JNY-002", "Digital base", "Workspace", "Google Drive, Gmail, Sheets, Forms, Calendar and Apps Script are the practical operating stack.", "Existing / organising", "Access groups need approval", "Explain private vault to public site handoff", "Use Sheets as ledgers and export queues", "Do not hard-code private account details"],
    ["JNY-003", "Community reach", "Publishing", "Website and social channels exist, with Facebook as strongest current reach.", "Active", "Rhythm needs helpers", "Reuse approved event stories across channels", "Track content and media status", "Review names, images and sponsor claims"],
    ["JNY-004", "Capacity", "Membership", "Member and volunteer growth is the main operational bottleneck.", "Needs growth", "Committee time is limited", "Make joining and volunteering obvious", "Route renewals, tasks and reminders", "Keep individual member status private"],
    ["JNY-005", "Field ops", "Competitions", "Solunar, weather, tide, maps, media and wrap-ups need one visual operating board.", "Planned / partly built", "Privacy and review rules required", "Show broad zones and approved recaps", "Export public-safe field JSON", "No precise GPS in public pages"],
    ["JNY-006", "Future layer", "Digital twin", "Offline-first app, catch logs, conservation data and sponsor pins are future evolutions.", "Planned", "Needs staged delivery", "Tell the growth story without over-promising", "Keep schemas extensible", "Separate club project from adjacent ecosystem ideas"],
  ],
  "ClubJourneyTable"
);

const calendar = addSheet("CalendarQueue");
title(calendar, "A1:H1", "Google Calendar Queue", "Draft event queue. Creating real calendar events still needs approval.");
writeTable(
  calendar,
  "A4",
  ["Queue ID", "Event ID", "Calendar Type", "Title", "Start", "End", "Invite Group", "Visibility", "Status"],
  [
    ["CAL-001", "EV-001", "Competition", "Sample Autumn Competition", "2026-05-09 06:00", "2026-05-09 15:30", "Members", "Private", "Draft"],
    ["CAL-002", "EV-002", "Working bee", "Sample Working Bee", "2026-05-16 08:00", "2026-05-16 11:00", "Volunteers", "Default", "Draft"],
    ["CAL-003", "EV-003", "Committee", "Sample Committee Meeting", "2026-05-20 18:00", "2026-05-20 19:30", "Committee", "Private", "Draft"],
  ],
  "CalendarQueueTable"
);

const calendarTypes = addSheet("CalendarEventTypes");
title(calendarTypes, "A1:I1", "Calendar Event Types", "Approval rules before creating live Google Calendar events.");
writeTable(
  calendarTypes,
  "A4",
  ["Type ID", "Label", "Calendar Lane", "Source Sheet", "Owner Role", "Visibility", "Default Reminder Pattern", "Public Export", "Privacy Rule"],
  [
    ["competition", "Competition", "PLFC Competitions", "Events", "Field lead", "Private", "7 days, 24 hours, 2 hours", "Broad event details and approved wrap-up", "No precise team GPS or private member details"],
    ["committee-meeting", "Committee meeting", "PLFC Committee", "ActionRegister", "Secretary", "Private", "7 days, 3 days, 1 hour", "Approved minutes or public update", "Draft agenda and recordings stay private"],
    ["working-bee", "Working bee", "PLFC Volunteers", "Events", "Volunteer coordinator", "Default", "7 days, 24 hours", "Approved callout and after-action story", "Volunteer contacts stay private"],
    ["renewal-cycle", "Membership renewal cycle", "PLFC Admin", "Members", "Secretary", "Private", "30 days, 7 days", "General renewal campaign", "Individual renewal status stays private"],
    ["content-publishing", "Content publishing", "PLFC Media", "MediaQueue", "Media lead", "Default", "3 days, 24 hours", "Approved post copy and media", "Unreviewed media stays private"],
    ["grant-sponsor-deadline", "Grant or sponsor deadline", "PLFC Grants and Sponsors", "PublicExports", "Secretary", "Private", "30 days, 14 days, 3 days", "Approved acknowledgement or outcome", "Negotiations and finance details stay private"],
  ],
  "CalendarEventTypesTable"
);

const exportsSheet = addSheet("PublicExports");
title(exportsSheet, "A1:H1", "Public-safe Exports", "Only reviewed rows feed the GitHub Pages public site.");
writeTable(
  exportsSheet,
  "A4",
  ["Export ID", "Target Page", "Source Sheet", "Summary", "Sensitive Removed", "Reviewer", "Export Status", "Updated", "Notes"],
  [
    ["EXP-001", "field-ops.html", "FieldOps", "Update map zones and weather cards", "Yes", "Secretary", "Ready", "2026-05-03", "Sample export"],
    ["EXP-002", "roadmap.html", "ActionRegister", "Update next actions", "Yes", "Secretary", "Draft", "", "Needs review"],
    ["EXP-003", "index.html", "Events", "Public event story", "Yes", "Media lead", "After review", "", "Needs media approval"],
  ],
  "PublicExportsTable"
);

for (const sheet of workbook.worksheets.items) {
  sheet.getRange("A1:I80").format.wrapText = true;
  sheet.getRange("A1:I80").format.columnWidthPx = 132;
  sheet.getRange("A1:A80").format.columnWidthPx = 116;
  sheet.getRange("D1:D80").format.columnWidthPx = 190;
  sheet.getRange("I1:I80").format.columnWidthPx = 180;
}
dashboard.getRange("A1:A20").format.columnWidthPx = 150;
dashboard.getRange("B1:B20").format.columnWidthPx = 145;
journey.getRange("D1:D80").format.columnWidthPx = 230;
journey.getRange("G1:I80").format.columnWidthPx = 170;
calendarTypes.getRange("A1:A80").format.columnWidthPx = 175;
calendarTypes.getRange("C1:C80").format.columnWidthPx = 170;
calendarTypes.getRange("G1:I80").format.columnWidthPx = 170;

for (const sheet of workbook.worksheets.items) {
  const safeName = sheet.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  const previewRange = sheet.name === "Dashboard" ? "A1:H17" : "A1:I16";
  const preview = await workbook.render({ sheetName: sheet.name, range: previewRange, scale: 1, format: "png" });
  const bytes = new Uint8Array(await preview.arrayBuffer());
  await fs.writeFile(new URL(`${safeName}.png`, qaDir), bytes);
  if (sheet.name === "Dashboard") {
    await fs.writeFile(new URL("dashboard-preview.png", qaDir), bytes);
  }
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(new URL("PLFC Backend Starter Workbook.xlsx", templatesDir));
