# Job Search Tracker

A web app that logs job applications and tracks their status. Entries save to a Google Sheet, so the data stays visible and editable outside the app too.

## What it does

You enter a company, role, status, date applied, and notes. The app saves the entry to a Google Sheet and shows it in a table. You can change an application's status directly from the table, and the update writes back to the sheet.

## How it works

- **index.html, style.css** -  the form and the table that lists your applications.
- **script.js** - validates the form, sends new entries to the backend, and loads existing entries into the table.
- **code.gs** - a Google Apps Script that reads from and writes to the Google Sheet.

## Notes

- Status options are Applied, Interview, Offer, and Rejected.
- Dates are parsed and displayed in `yyyy-MM-dd` format on the frontend, regardless of how Google Sheets stores them internally.
