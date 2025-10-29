console.log('✅ client.js loaded');

function getEl(id) {
  return document.getElementById(id);
}

function isAlphanumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}

function isDigits(str) {
  return /^\d+$/.test(str);
}

function startsWithDigit(str) {
  return /^\d/.test(str);
}

function isEmailLike(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}


function showError(inputId, message) {
  const input = getEl(inputId);
  const errorEl = getEl(`${inputId}_error`);
  input.classList.add('error-input');
  errorEl.classList.add('error-text');
  errorEl.textContent = message;
}

function clearError(inputId) {
  const input = getEl(inputId);
  const errorEl = getEl(`${inputId}_error`);
  input.classList.remove('error-input');
  errorEl.textContent = '';
  errorEl.classList.remove('error-text');
}


function validateName(value, label) {
  if (!value) return { ok: false, msg: `${label} is required.` };
  if (!isAlphanumeric(value)) return { ok: false, msg: `${label} must contain letters and numbers only.` };
  if (value.length > 20) return { ok: false, msg: `${label} must be at most 20 characters.` };
  return { ok: true };
}

function validateEmail(value) {
  if (!value) return { ok: false, msg: "Email is required." };
  if (!isEmailLike(value)) return { ok: false, msg: "Enter a valid email address." };
  return { ok: true };
}

function validatePhone(value) {
  const normalized = value.replace(/\s+/g, '');
  if (!normalized) return { ok: false, msg: "Phone number is required." };
  if (!isDigits(normalized)) return { ok: false, msg: "Phone number must contain digits only." };
  if (normalized.length !== 10) return { ok: false, msg: "Phone number must be exactly 10 digits." };
  return { ok: true };
}

function validateEircode(value) {
  const normalized = value.trim().toUpperCase();
  if (!normalized) return { ok: false, msg: "Eircode is required." };
  if (normalized.length !== 6) return { ok: false, msg: "Eircode must be 6 characters." };
  if (!startsWithDigit(normalized)) return { ok: false, msg: "Eircode must start with a number." };
  if (!isAlphanumeric(normalized)) return { ok: false, msg: "Eircode must contain letters and numbers only." };
  return { ok: true };
}


 handleSubmit(event) {
  console.log('🚀 handleSubmit fired');
  event.preventDefault();
  getEl('messages').textContent = '';
  getEl('messages').className = '';

  const fields = ['first_name', 'last_name', 'email', 'phone_number', 'eircode'];
  let firstInvalid = null;

  fields.forEach(clearErrofunctionr);

  const values = {
    first_name: getEl('first_name').value.trim(),
    last_name: getEl('last_name').value.trim(),
    email: getEl('email').value.trim(),
    phone_number: getEl('phone_number').value.trim(),
    eircode: getEl('eircode').value.trim()
  };

  const validators = {
    first_name: validateName(values.first_name, 'First name'),
    last_name: validateName(values.last_name, 'Last name'),
    email: validateEmail(values.email),
    phone_number: validatePhone(values.phone_number),
    eircode: validateEircode(values.eircode)
  };

  for (const field of fields) {
    const result = validators[field];
    if (!result.ok) {
      showError(field, result.msg);
      if (!firstInvalid) firstInvalid = field;
    }
  }

  if (firstInvalid) {
    getEl(firstInvalid).focus();
    getEl('messages').textContent = "Please fix the highlighted fields.";
    getEl('messages').classList.add('error-text');
  } else {
    getEl('messages').textContent = "Form is valid. Ready to submit.";
    getEl('messages').classList.add('success-text');
    } else {
  // Build payload from inputs
  const payload = {
    first_name: getEl('first_name').value.trim(),
    last_name:  getEl('last_name').value.trim(),
    email:      getEl('email').value.trim(),
    phone_number: getEl('phone_number').value.trim(),
    eircode:      getEl('eircode').value.trim().toUpperCase()
  };

  // Disable button to prevent double submit
  const submitBtn = event.submitter || document.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  // Send to backend
  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(async (resp) => {
      const data = await resp.json();
      const msg = getEl('messages');
      msg.className = '';

      if (resp.ok) {
        msg.textContent = data.message || 'Form submitted successfully.';
        msg.classList.add('success-text');

        // Optional: clear form after success
        ['first_name','last_name','email','phone_number','eircode'].forEach(clearError);
        document.getElementById('userForm').reset();
        getEl('first_name').focus();

        // Optional: show ID returned by the server
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
      const msg = getEl('messages');
      msg.className = '';
      msg.textContent = 'Network error. Try again.';
      msg.classList.add('error-text');
      console.error(err);
    })
    .finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
}



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