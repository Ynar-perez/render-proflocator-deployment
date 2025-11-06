document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    // Navigation buttons
    const navHomeBtn = document.getElementById('nav-home');
    const navProfSecBtn = document.getElementById('nav-profSec');

    // Page content sections
    const homePage = document.getElementById('home-page');
    const profPage = document.getElementById('prof-page');

    // Collections for easier management
    const allPages = [homePage, profPage];
    const allNavBtns = [navHomeBtn, navProfSecBtn];

    // --- Functions ---

    /**
     * Hides all main content pages.
     */
    function hideAllPages() {
        allPages.forEach(page => {
            if (page) page.style.display = 'none';
        });
    }

    /**
     * Removes the 'active' class from all navigation buttons.
     */
    function deactivateAllNavs() {
        allNavBtns.forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
    }

    /**
     * Shows a specific page and sets its corresponding navigation button to active.
     * @param {HTMLElement} pageToShow - The page element to show.
     * @param {HTMLElement} navBtnToActivate - The navigation button to activate.
     */
    function showPage(pageToShow, navBtnToActivate) {
        hideAllPages();
        deactivateAllNavs();

        if (pageToShow) pageToShow.style.display = 'flex'; // Use 'flex' as your sections are flex containers
        if (navBtnToActivate) navBtnToActivate.classList.add('active');
    }

    // --- Event Listeners ---
    navHomeBtn.addEventListener('click', () => showPage(homePage, navHomeBtn));
    navProfSecBtn.addEventListener('click', () => showPage(profPage, navProfSecBtn));

    // --- Initial State ---
    showPage(homePage, navHomeBtn); // Show the home page by default when the app loads
});