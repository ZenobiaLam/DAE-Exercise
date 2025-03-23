document.addEventListener('DOMContentLoaded', function() {
    // Log to confirm script is loading
    console.log('Script is loaded');

    // Get buttons
    const toPage2Button = document.getElementById('toPage2Btn');
    const toPage1Button = document.getElementById('toPage1Btn');

    // Add click event listeners
    toPage2Button.addEventListener('click', function() {
        switchPage('page2');
    });

    toPage1Button.addEventListener('click', function() {
        switchPage('page1');
    });
});

function switchPage(pageId) {
    // Log the page switch attempt
    console.log('Attempting to switch to:', pageId);

    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        console.log('Switched to:', pageId);
    } else {
        console.error('Page not found:', pageId);
    }
}