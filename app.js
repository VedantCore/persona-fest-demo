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

    // --- LOGIN SYSTEM ---
    const SUPER_ADMIN_EMAIL = "vserva2006@gmail.com"; 

    function getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    function saveUser(email, password, isAdmin = false) {
        let users = getUsers();
        if (users.find(u => u.email === email)) return false;
        users.push({ email, password, isAdmin });
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }

    function checkUser(email, password) {
        let users = getUsers();
        return users.find(u => u.email === email && u.password === password);
    }

    function setLoggedIn(email) {
        localStorage.setItem('loggedInUser', email);
    }

    function getLoggedIn() {
        return localStorage.getItem('loggedInUser');
    }

    function logout() {
        localStorage.removeItem('loggedInUser');
        location.reload();
    }

    function isAdmin(email) {
        if (!email) return false;
        if (email === SUPER_ADMIN_EMAIL) return true;
        let users = getUsers();
        let user = users.find(u => u.email === email);
        return user && user.isAdmin;
    }

    // Handle login/registration forms if they exist
    document.addEventListener('DOMContentLoaded', function() {
        // Login form handling
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = loginForm.querySelector('#loginEmail').value.trim();
                const password = loginForm.querySelector('#loginPassword').value;
                const loginMsg = document.getElementById('loginMsg');
                
                if (checkUser(email, password)) {
                    setLoggedIn(email);
                    document.getElementById('loginModal').style.display = "none";
                    if (typeof afterLogin === 'function') {
                        afterLogin();
                    } else {
                        window.location.reload();
                    }
                } else {
                    if (loginMsg) loginMsg.textContent = "Invalid email or password.";
                }
            });
        }
        
        // Registration form handling
        const registerForm = document.getElementById('registerForm');
        if (registerForm && registerForm.querySelector('#registerEmail')) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = registerForm.querySelector('#registerEmail').value.trim();
                const password = registerForm.querySelector('#registerPassword').value;
                const registerMsg = document.getElementById('registerMsg');
                
                if (!email || !password) {
                    if (registerMsg) registerMsg.textContent = "Please fill all fields.";
                    return;
                }
                
                if (saveUser(email, password, false)) {
                    if (registerMsg) {
                        registerMsg.style.color = "green";
                        registerMsg.textContent = "Registration successful! Please login.";
                    }
                    // Show login modal if available
                    if (typeof showLoginModal === 'function') {
                        setTimeout(showLoginModal, 1000);
                    }
                } else {
                    if (registerMsg) {
                        registerMsg.style.color = "red";
                        registerMsg.textContent = "User already exists.";
                    }
                }
            });
        }
        
        // Function to handle after login actions
        window.afterLogin = function() {
            const user = getLoggedIn();
            if (user) {
                // Handle profile and signup sections if they exist
                const signupSection = document.getElementById('signup');
                if (signupSection) signupSection.style.display = "block";
                
                const profileSection = document.getElementById('profile');
                if (profileSection) {
                    profileSection.style.display = "block";
                    loadProfile();
                }
                
                // Handle buttons visibility
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) logoutBtn.style.display = "inline-block";
                
                const signupNavBtn = document.getElementById('signupNavBtn');
                if (signupNavBtn) signupNavBtn.style.display = "inline-block";
                
                // Fill email in signup form if present
                const signupEmail = document.getElementById('signupEmail');
                if (signupEmail) signupEmail.value = user;
                
                // Show dev console for admins
                if (isAdmin(user)) {
                    const toggleDevBtn = document.getElementById('toggleDevConsole');
                    if (toggleDevBtn) toggleDevBtn.style.display = "inline-block";
                }
            }
        };
        
        // Initialize any additional features
        if (typeof initLiquidGlass === 'function') {
            initLiquidGlass();
        }
    });

    // Function to load profile data
    function loadProfile() {
        const profileForm = document.getElementById('profileForm');
        if (!profileForm) return;
        
        const user = getLoggedIn();
        if (!user) return;
        
        const data = JSON.parse(localStorage.getItem(`profile_${user}`) || '{}');
        if (profileForm.profileName) profileForm.profileName.value = data.name || '';
        if (profileForm.profilePhone) profileForm.profilePhone.value = data.phone || '';
        if (profileForm.profileDOB) profileForm.profileDOB.value = data.dob || '';
        if (profileForm.profileClass) profileForm.profileClass.value = data.class || '';
        if (profileForm.profileEnrollment) profileForm.profileEnrollment.value = data.enrollment || '';
        if (profileForm.profileYear) profileForm.profileYear.value = data.year || '';
    }

    // Example: Function to send registration data to MongoDB backend
    function registerUser(username, password) {
        // Implement this if needed, using fetch API
        console.log("Registration data ready to send:", username, password);
        // Commented out to prevent errors without server
        /*
        fetch('/add-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Username: username, Password: password })
        })
        .then(res => res.json())
        .then(data => {
            // Handle response
        })
        .catch(err => console.error("Error registering user:", err));
        */
    }
});