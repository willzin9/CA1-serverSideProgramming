
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


function handleSubmit(event) {
  event.preventDefault();
  getEl('messages').textContent = '';
  getEl('messages').className = '';

  const fields = ['first_name', 'last_name', 'email', 'phone_number', 'eircode'];
  let firstInvalid = null;

  fields.forEach(clearError);

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
    
  }
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