// Modal functionality for authentication
document.addEventListener('DOMContentLoaded', function() {
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const modalClose = document.getElementById('modal-close');
    const signinToggle = document.getElementById('signin-toggle');
    const signupToggle = document.getElementById('signup-toggle');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const modalTitle = document.getElementById('modal-title');

    // Open modal
    if (authBtn) {
        authBtn.addEventListener('click', function() {
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal
    function closeModal() {
        authModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && authModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Toggle between sign in and sign up
    if (signinToggle && signupToggle) {
        signinToggle.addEventListener('click', function() {
            signinToggle.classList.add('active');
            signupToggle.classList.remove('active');
            signinForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            modalTitle.textContent = 'Sign In';
        });

        signupToggle.addEventListener('click', function() {
            signupToggle.classList.add('active');
            signinToggle.classList.remove('active');
            signupForm.classList.remove('hidden');
            signinForm.classList.add('hidden');
            modalTitle.textContent = 'Sign Up';
        });
    }

    // Handle form submissions
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            
            // Here you would typically send the data to your backend
            console.log('Sign in attempt:', { email, password });
            
            // Show success message (replace with actual logic)
            alert('Sign in successful! (This is a demo)');
            closeModal();
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            
            // Basic validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long!');
                return;
            }
            
            // Here you would typically send the data to your backend
            console.log('Sign up attempt:', { name, email, password });
            
            // Show success message (replace with actual logic)
            alert('Sign up successful! (This is a demo)');
            closeModal();
        });
    }
});