import { initNav } from './nav.js';
import { initCart } from './cart.js';
import { initGallery, initGalleryModal } from './gallery.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initCart();
    initGallery();
    initGalleryModal();
});