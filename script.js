document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const profileIconBtn = document.getElementById('profile-icon-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    const currentTheme = localStorage.getItem('theme');

    // Apply the saved theme on page load
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.removeItem('theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    if (profileIconBtn) {
        profileIconBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from closing the dropdown immediately
            profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (profileDropdown && !profileDropdown.contains(event.target) && !profileIconBtn.contains(event.target)) {
            profileDropdown.style.display = 'none';
        }
    });

    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // This assumes you have a signOut function in your firebaseauth.js
            // and that it's globally available or you have another way to call it.
            alert("Logging out..."); // Placeholder for actual logout logic
            window.location.href = 'index.html';
        });
    }
});