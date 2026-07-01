const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyQNAx6x6B8yMkfwdLfohhFgAu03jK4XnLxpxZxaHg79rUxOfQIFVgNX4TkHt5nFM2zQg/exec'; // paste your deployed Apps Script URL here

const requiredFields = ['company', 'role', 'status', 'dateApplied'];

document.addEventListener('DOMContentLoaded', loadApplications);

document.getElementById('trackerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  for (let i = 0; i < requiredFields.length; i++) {
    const field = document.getElementById(requiredFields[i]);
    if (!field.value.trim()) {
      alert('Please fill out all required fields before submitting.');
      field.focus();
      return;
    }
  }

  const company = document.getElementById('company').value.trim();
  const role = document.getElementById('role').value.trim();
  const status = document.getElementById('status').value;
  const dateApplied = document.getElementById('dateApplied').value;
  const notes = document.getElementById('notes').value.trim();

  if (!status) {
    alert('Please select a status.');
    return;
  } else if (!dateApplied) {
    alert('Please enter the date applied.');
    return;
  }

  const record = { company, role, status, dateApplied, notes };

  addApplication(record);
  this.reset();
});

function addApplication(record) {
  fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(record)
  })
    .then(function () {
      loadApplications();
    })
    .catch(function (err) {
      console.error('Could not save application:', err);
      alert('Something went wrong while saving. Please try again.');
    });
}

function loadApplications() {
  const loadingMessage = document.getElementById('loadingMessage');
  loadingMessage.classList.remove('hidden');
  loadingMessage.textContent = 'Loading applications...';

  fetch(WEB_APP_URL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderApplications(data);
      loadingMessage.classList.add('hidden');
    })
    .catch(function (err) {
      console.error('Could not load applications:', err);
      loadingMessage.textContent = 'Could not load applications. Please refresh.';
    });
}

function getStatusClass(status) {
  let statusClass;

  switch (status) {
    case 'Applied':
      statusClass = 'status-applied';
      break;
    case 'Interview':
      statusClass = 'status-interview';
      break;
    case 'Offer':
      statusClass = 'status-offer';
      break;
    case 'Rejected':
      statusClass = 'status-rejected';
      break;
    case 'Accepted':
      statusClass = 'status-accepted';
      break;
    default:
      statusClass = '';
  }

  return statusClass;
}

function formatDateForDisplay(dateString) {
  if (!dateString) {
    return '';
  }

  const parsed = new Date(dateString);

  if (isNaN(parsed.getTime())) {
    return dateString;
  } else if (parsed.getFullYear() > 3000 || parsed.getFullYear() < 1900) {
    return 'Invalid date';
  }

  return parsed.toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
}

function renderApplications(applications) {
  const tableBody = document.getElementById('applicationTableBody');
  const emptyMessage = document.getElementById('emptyMessage');
  tableBody.innerHTML = '';

  if (applications.length === 0) {
    emptyMessage.classList.remove('hidden');
    return;
  } else {
    emptyMessage.classList.add('hidden');
  }

  const statuses = ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];

  applications.forEach(function (app) {
    const row = document.createElement('tr');

    const select = document.createElement('select');
    select.className = 'status-select ' + getStatusClass(app.status);

    statuses.forEach(function (statusOption) {
      const option = document.createElement('option');
      option.value = statusOption;
      option.textContent = statusOption;
      if (statusOption === app.status) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener('change', function () {
      updateStatus(app.row, this.value, select);
    });

    row.innerHTML = `
      <td>${app.company}</td>
      <td>${app.role}</td>
      <td class="status-cell"></td>
      <td>${formatDateForDisplay(app.dateApplied)}</td>
      <td>${app.notes || ''}</td>
    `;

    row.querySelector('.status-cell').appendChild(select);
    tableBody.appendChild(row);
  });
}

function updateStatus(row, newStatus, selectEl) {
  selectEl.className = 'status-select ' + getStatusClass(newStatus);

  fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'update', row: row, status: newStatus })
  }).catch(function (err) {
    console.error('Could not update status:', err);
    alert('Could not update status. Please try again.');
  });
}
