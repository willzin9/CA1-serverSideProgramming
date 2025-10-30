console.log('✅ client.js loaded');

// ---------- helpers ----------
function getEl(id) { return document.getElementById(id); }
function isAlphanumeric(str) { return /^[a-zA-Z0-9]+$/.test(str); }
function isDigits(str) { return /^\d+$/.test(str); }
function startsWithDigit(str) { return /^\d/.test(str); }
function isEmailLike(str) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str); }

// ---------- error ui ----------
function showError(inputId, message) {
  const input = getEl(inputId);
  const errorEl = getEl(`${inputId}_error`);
  if (input) input.classList.add('error-input');
  if (errorEl) {
    errorEl.classList.add('error-text');
    errorEl.textContent = message;
  }
}
function clearError(inputId) {
  const input = getEl(inputId);
  const errorEl = getEl(`${inputId}_error`);
  if (input) input.classList.remove('error-input');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('error-text');
  }
}

// ---------- validators ----------
function validateName(value, label) {
  if (!value) return { ok: false, msg: `${label} is required.` };
  if (!isAlphanumeric(value)) return { ok: false, msg: `${label} must contain letters and numbers only.` };
  if (value.length > 20) return { ok: false, msg: `${label} must be at most 20 characters.` };
  return { ok: true };
}
function validateEmail(value) {
  if (!value) return { ok: false, msg: 'Email is required.' };
  if (!isEmailLike(value)) return { ok: false, msg: 'Enter a valid email address.' };
  return { ok: true };
}
function validatePhone(value) {
  const normalized = String(value).replace(/\s+/g, '');
  if (!normalized) return { ok: false, msg: 'Phone number is required.' };
  if (!isDigits(normalized)) return { ok: false, msg: 'Phone number must contain digits only.' };
  if (normalized.length !== 10) return { ok: false, msg: 'Phone number must be exactly 10 digits.' };
  return { ok: true };
}
function validateEircode(value) {
  const normalized = String(value).trim().toUpperCase();
  if (!normalized) return { ok: false, msg: 'Eircode is required.' };
  if (normalized.length !== 6) return { ok: false, msg: 'Eircode must be 6 characters.' };
  if (!startsWithDigit(normalized)) return { ok: false, msg: 'Eircode must start with a number.' };
  if (!isAlphanumeric(normalized)) return { ok: false, msg: 'Eircode must contain letters and numbers only.' };
  return { ok: true };
}

// ---------- submit handler ----------
function handleSubmit(event) {
  event.preventDefault();
  console.log('🚀 handleSubmit fired');

  const msg = getEl('messages');
  msg.textContent = '';
  msg.className = '';

  const fields = ['first_name', 'last_name', 'email', 'phone_number', 'eircode'];

  // clear previous field errors
  fields.forEach(clearError);

  // gather payload
  const payload = {
    first_name: getEl('first_name').value.trim(),
    last_name: getEl('last_name').value.trim(),
    email: getEl('email').value.trim(),
    phone_number: getEl('phone_number').value.trim(),
    eircode: getEl('eircode').value.trim().toUpperCase(),
  };

  // client-side validation (mirror server)
  const results = {
    first_name: validateName(payload.first_name, 'First name'),
    last_name: validateName(payload.last_name, 'Last name'),
    email: validateEmail(payload.email),
    phone_number: validatePhone(payload.phone_number),
    eircode: validateEircode(payload.eircode),
  };

  let firstInvalid = null;
  for (const f of fields) {
    if (!results[f].ok) {
      showError(f, results[f].msg);
      if (!firstInvalid) firstInvalid = f;
    }
  }

  if (firstInvalid) {
    getEl(firstInvalid).focus();
    msg.textContent = 'Please fix the highlighted fields.';
    msg.classList.add('error-text');
    return;
  }

  // disable submit (prevent double click)
  const submitBtn = event.submitter || document.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  // send to backend
  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async (resp) => {
      const data = await resp.json();
      msg.className = '';

      if (resp.ok) {
        msg.textContent = data.message || 'Form submitted successfully.';
        msg.classList.add('success-text');

        // optional: reset form
        getEl('userForm').reset();
        getEl('first_name').focus();

        // optional: show DB id
        if (data.id) {
          const note = document.createElement('div');
          note.textContent = `Saved with ID #${data.id}`;
          note.classList.add('success-text');
          msg.appendChild(document.createElement('br'));
          msg.appendChild(note);
        }
      } else if (resp.status === 400 && data.errors) {
        data.errors.forEach(e => showError(e.field, e.message));
        msg.textContent = 'Please fix the highlighted fields.';
        msg.classList.add('error-text');
        if (data.errors.length) getEl(data.errors[0].field).focus();
      } else {
        msg.textContent = data.message || 'Unexpected server error.';
        msg.classList.add('error-text');
      }
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      msg.className = '';
      msg.textContent = 'Network error. Try again.';
      msg.classList.add('error-text');
    })
    .finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
}

// attach listeners
window.addEventListener('DOMContentLoaded', () => {
  const form = getEl('userForm');
  form.addEventListener('submit', handleSubmit);

  const fields = ['first_name', 'last_name', 'email', 'phone_number', 'eircode'];
  fields.forEach(id => {
    const input = getEl(id);
    input.addEventListener('input', () => clearError(id));
    input.addEventListener('blur', () => clearError(id));
  });
});
