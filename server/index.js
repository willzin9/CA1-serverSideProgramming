// 🧱 1️⃣ Imports and setup
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log('REQ:', req.method, req.url);
  next();
});


const PORT = process.env.PORT || 3000;

// ===== 2️⃣ Helper validation functions =====
const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);
const isDigits = (str) => /^\d+$/.test(str);
const startsWithDigit = (str) => /^\d/.test(str);
const isEmailLike = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

// ===== 3️⃣ Form validation route =====
app.post('/submit', (req, res) => {
  try {
    const {
      first_name = '',
      last_name = '',
      email = '',
      phone_number = '',
      eircode = '',
    } = req.body || {};

    const errors = [];

    // --- Validation rules ---

    // First name
    if (!first_name)
      errors.push({ field: 'first_name', message: 'First name is required.' });
    else if (!isAlphanumeric(first_name))
      errors.push({
        field: 'first_name',
        message: 'First name must contain letters and numbers only.',
      });
    else if (first_name.length > 20)
      errors.push({
        field: 'first_name',
        message: 'First name must be at most 20 characters.',
      });

    // Last name
    if (!last_name)
      errors.push({ field: 'last_name', message: 'Last name is required.' });
    else if (!isAlphanumeric(last_name))
      errors.push({
        field: 'last_name',
        message: 'Last name must contain letters and numbers only.',
      });
    else if (last_name.length > 20)
      errors.push({
        field: 'last_name',
        message: 'Last name must be at most 20 characters.',
      });

    // Email
    if (!email)
      errors.push({ field: 'email', message: 'Email is required.' });
    else if (!isEmailLike(email))
      errors.push({
        field: 'email',
        message: 'Enter a valid email address.',
      });

    // Phone number
    if (!phone_number)
      errors.push({ field: 'phone_number', message: 'Phone number is required.' });
    else if (!isDigits(phone_number))
      errors.push({
        field: 'phone_number',
        message: 'Phone number must contain digits only.',
      });
    else if (phone_number.length !== 10)
      errors.push({
        field: 'phone_number',
        message: 'Phone number must be exactly 10 digits.',
      });

    // Eircode
    if (!eircode)
      errors.push({ field: 'eircode', message: 'Eircode is required.' });
    else if (eircode.length !== 6)
      errors.push({
        field: 'eircode',
        message: 'Eircode must be 6 characters.',
      });
    else if (!startsWithDigit(eircode))
      errors.push({
        field: 'eircode',
        message: 'Eircode must start with a number.',
      });
    else if (!isAlphanumeric(eircode))
      errors.push({
        field: 'eircode',
        message: 'Eircode must contain letters and numbers only.',
      });

    // --- Response handling ---
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    res.status(200).json({
      success: true,
      message: 'Validated. Ready to insert.',
    });
  } catch (err) {
    console.error('POST /submit error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// 🚦 4️⃣ Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// ⚙️ 5️⃣ Global error handler
app.use((err, req, res, next) => {
  console.error('Something went wrong:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// 🚀 6️⃣ Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
