document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signupForm');
    const message = document.getElementById('signupMessage');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const event = form.event.value;
            if (name && email && event) {
                message.textContent = `Thank you, ${name}! You have signed up for the ${event.charAt(0).toUpperCase() + event.slice(1)} event.`;
                message.style.color = 'green';
                form.reset();
            } else {
                message.textContent = 'Please fill in all fields.';
                message.style.color = 'red';
            }
        });
    }
});