export function debounce(fn, delay = 500) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) return; // Prevent re-trigger while waiting
      fn.apply(this, args);
      timeoutId = setTimeout(() => {
        timeoutId = null;
      }, delay);
    };
}

export function getGalleryImages() {
    const thumbs = document.querySelectorAll('.product__thumb img');
    return Array.from(thumbs).map(img => img.dataset.full || img.src);
}
