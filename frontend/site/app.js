const form = document.getElementById('regForm');
const msg = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  msg.className = 'msg';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!name || !email || password.length < 8) {
    msg.textContent = 'Please fill all fields. Password must be at least 8 characters.';
    msg.classList.add('error');
    return;
  }

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      msg.textContent = data.error || 'Registration failed';
      msg.classList.add('error');
      return;
    }

    msg.textContent = 'Registered successfully! You can now log in.';
    msg.classList.add('success');
    form.reset();
  } catch (err) {
    console.error(err);
    msg.textContent = 'Network error. Try again later.';
    msg.classList.add('error');
  }
});
