export function initNav() {
    const openMenuButton = document.querySelector('.header__menu-toggle');
    const closeMenuButton = document.querySelector('.nav__close');
    const mobileNav = document.querySelector('.nav--mobile');
    const navOverlay = document.querySelector('.nav__overlay');
    const navDrawer = document.querySelector('.nav__drawer');

    openMenuButton.addEventListener('click', () => {
        mobileNav.hidden = false;
        requestAnimationFrame(() => {
            navDrawer.classList.add('open-drawer');
        });
    });

    function closeDrawer() {
        navDrawer.classList.remove('open-drawer');
        navDrawer.addEventListener('transitionend', () => {
            mobileNav.hidden = true;
        }, { once: true }
        );
    }
   
    closeMenuButton.addEventListener('click', closeDrawer);
    navOverlay.addEventListener('click', closeDrawer);
}