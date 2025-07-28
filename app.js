document.addEventListener('DOMContentLoaded', function () {
    // Signup form logic (if present)
    const form = document.getElementById('signupForm');
    const message = document.getElementById('signupMessage');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = form.name.value.trim();
            // Use value from email input, which may be readonly and prefilled
            const emailInput = form.querySelector('input[name="email"], #signupEmail');
            const email = emailInput ? emailInput.value.trim() : '';
            const event = form.event.value;
            if (name && email && event) {
                message.textContent = `Thank you, ${name}! You have signed up for the ${event.charAt(0).toUpperCase() + event.slice(1)} event.`;
                message.style.color = 'green';
                form.reset();
                // Refill email if it's readonly/prefilled
                if (emailInput && emailInput.hasAttribute('readonly')) {
                    emailInput.value = email;
                }
            } else {
                message.textContent = 'Please fill in all fields.';
                message.style.color = 'red';
            }
        });
    }

    // Dropdown with delayed hide and animation
    var dropdown = document.querySelector('.navbar__dropdown');
    var hideTimeout;

    if (dropdown) {
        dropdown.addEventListener('mouseenter', function () {
            clearTimeout(hideTimeout);
            if (!dropdown.classList.contains('open')) {
                dropdown.classList.add('open');
            }
        });

        dropdown.addEventListener('mouseleave', function () {
            hideTimeout = setTimeout(function () {
                dropdown.classList.remove('open');
            }, 250); // 250ms delay before hiding
        });
    }

    // Ensure click on "Events" still navigates
    var eventsDropdownLink = document.getElementById('eventsDropdownLink');
    if (eventsDropdownLink) {
        eventsDropdownLink.addEventListener('click', function(e) {
            window.location.href = 'tech.html';
        });
    }

    // Section fade-in on scroll
    const animatedSections = document.querySelectorAll(
        '.hero, .events, .about, .signup, .profile, .dev-console, footer, .event-card'
    );
    animatedSections.forEach(sec => {
        sec.style.opacity = 0;
        sec.style.transition = 'opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
    });
    function revealOnScroll() {
        const trigger = window.innerHeight * 0.92;
        animatedSections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            if (rect.top < trigger) sec.style.opacity = 1;
        });
    }
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // Example: Send registration data to MongoDB backend
    function registerUser(username, password) {
        fetch('/add-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Username: username, Password: password })
        })
        .then(res => res.json())
        .then(data => {
            // Handle success or error
            if (data.message) {
                alert('Registration successful!');
            } else {
                alert('Registration failed: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(() => alert('Network error'));
    }

    // Example usage: Call registerUser when needed
    // registerUser('testuser', 'testpass');
});