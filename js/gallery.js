import { getGalleryImages } from "./utils.js";

export function initGallery() {
    const thumbnails = document.querySelectorAll('.product__thumb');
    const gallery = document.querySelector('.product__gallery');
    const galleryDisplay = gallery.querySelector('.product__image');

    thumbnails.forEach(thumb => thumb.addEventListener('click', () => {
        const img = thumb.querySelector('img');
        galleryDisplay.src = img.dataset.full;

        thumbnails.forEach(t => t.classList.remove('product__thumb--active'));
        thumb.classList.add('product__thumb--active');
    }));
}

export function initGalleryModal() {
    const modal = document.querySelector('.gallery-modal');
    const closeBtn = modal.querySelector('.gallery-modal__close');
    const mainImg = modal.querySelector('.gallery-modal__image');
    const prevBtn = modal.querySelector('.gallery-modal__btn--prev');
    const nextBtn = modal.querySelector('.gallery-modal__btn--next');
    const thumbsContainer = modal.querySelector('.gallery-modal__thumbnails');

    const images = getGalleryImages();
    let currentIndex = 0;

    const galleryDisplay = document.querySelector('.product__image');

    mainImg.src = images[currentIndex];

    images.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.classList.add('gallery-modal__thumb');

        if (index === currentIndex) thumb.classList.add('active');

        thumb.addEventListener('click', () => {
            currentIndex = index;
            updateMainImage();
        });

        thumbsContainer.appendChild(thumb);
    });

    function updateMainImage() {
        mainImg.src = images[currentIndex];
      
        const allThumbs = thumbsContainer.querySelectorAll('img');
        allThumbs.forEach((t, i) => {
          t.classList.toggle('active', i === currentIndex);
        });
    }

    function updateImageViews() {
        if (galleryDisplay) galleryDisplay.src = images[currentIndex];
        updateMainImage();
        const mainThumbs = document.querySelectorAll('.product__thumb');
        mainThumbs.forEach(thumb => {
            const img = thumb.querySelector('img');
            const filename = img.dataset.full.split('/').pop();
            const isActive = images[currentIndex].includes(filename);
            thumb.classList.toggle('product__thumb--active', isActive);
        });
    }

    function goToNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateImageViews();
    }
      
    function goToPrevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImageViews();
    }

    const galleryImage = document.querySelector('.product__image');

    galleryImage.addEventListener('click', () => {
        const currentImageSrc = galleryImage.src;
        const currentFilename = currentImageSrc.split('/').pop();
        const startIndex = images.findIndex(img => img.includes(currentFilename));
        currentIndex = startIndex !== -1 ? startIndex : 0;

        updateMainImage();
        modal.classList.add('open');
    });
      
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    // Mobile view buttons
    const mobileNextBtn = document.querySelector('.product__gallery-btn--next');
    const mobilePrevBtn = document.querySelector('.product__gallery-btn--prev');

    if (mobileNextBtn) mobileNextBtn.addEventListener('click', goToNextImage);
    if (mobilePrevBtn) mobilePrevBtn.addEventListener('click', goToPrevImage);

    // Modal view buttons
    nextBtn.addEventListener('click', goToNextImage);
    prevBtn.addEventListener('click', goToPrevImage);
}
