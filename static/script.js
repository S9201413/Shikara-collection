// --- GLOBAL FUNCTIONS FOR UI ---

window.swapImage = function(src) {
    document.getElementById('main-detail-image').src = src;
};

window.shareProduct = function(title) {
    if (navigator.share) {
        navigator.share({
            title: 'Shikara Collection: ' + title,
            text: 'Check out this ' + title + ' from Shikara!',
            url: window.location.href
        }).catch(console.error);
    } else {
        alert("Copy this link to share: " + window.location.href);
    }
};

// --- LIGHTBOX & GALLERY LOGIC ---
let galleryImages = [];
let currentIndex = 0;
let isZoomed = false;
let touchStartX = 0;
let touchEndX = 0;

window.openLightbox = function() {
    const modal = document.getElementById('lightbox-modal');
    const mainImg = document.getElementById('lightbox-main-img');
    
    // 1. Gather all images from the thumbnails
    const thumbs = document.querySelectorAll('.thumbnail-gallery .thumbnail');
    galleryImages = Array.from(thumbs).map(t => t.src);
    
    // 2. Find which image the user clicked
    const currentSrc = document.getElementById('main-detail-image').src;
    currentIndex = galleryImages.indexOf(currentSrc);
    if (currentIndex === -1) currentIndex = 0;

    // 3. Reset state and load image
    isZoomed = false;
    mainImg.style.transform = 'scale(1)';
    mainImg.style.cursor = 'zoom-in';
    mainImg.src = galleryImages[currentIndex];

    // 4. Copy thumbnails to the bottom of the lightbox
    const lightboxThumbContainer = document.getElementById('lightbox-thumb-container');
    lightboxThumbContainer.innerHTML = document.querySelector('.thumbnail-gallery').innerHTML;
    updateLightboxActiveThumb();

    // 5. Override thumbnail clicks inside the lightbox
    const newThumbs = lightboxThumbContainer.querySelectorAll('img');
    newThumbs.forEach((thumb, index) => {
        thumb.onclick = function() {
            currentIndex = index;
            changeLightboxImage(0); // 0 means just refresh the current index
        };
    });

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
};

window.closeLightbox = function() {
    document.getElementById('lightbox-modal').style.display = 'none';
    document.body.style.overflow = 'auto'; 
};

// --- SWIPE & NAVIGATION LOGIC ---

window.changeLightboxImage = function(direction) {
    // Move the index forward or backward
    currentIndex += direction;
    
    // Loop around if we hit the end or beginning
    if (currentIndex >= galleryImages.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = galleryImages.length - 1;

    // Update the main image and reset the zoom
    const mainImg = document.getElementById('lightbox-main-img');
    mainImg.src = galleryImages[currentIndex];
    isZoomed = false;
    mainImg.style.transform = 'scale(1)';
    mainImg.style.cursor = 'zoom-in';
    
    updateLightboxActiveThumb();
};

function updateLightboxActiveThumb() {
    const thumbs = document.getElementById('lightbox-thumb-container').querySelectorAll('img');
    thumbs.forEach((t, i) => {
        if (i === currentIndex) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });
}

// Touch event handlers for mobile swiping
window.handleTouchStart = function(e) {
    touchStartX = e.changedTouches[0].screenX;
};

window.handleTouchEnd = function(e) {
    touchEndX = e.changedTouches[0].screenX;
    
    // Only swipe if not currently zoomed in
    if (!isZoomed) {
        if (touchEndX < touchStartX - 40) changeLightboxImage(1); // Swipe Left
        if (touchEndX > touchStartX + 40) changeLightboxImage(-1); // Swipe Right
    }
};

// Double click to zoom
window.toggleZoom = function() {
    const img = document.getElementById('lightbox-main-img');
    isZoomed = !isZoomed;
    
    if (isZoomed) {
        img.style.transform = 'scale(2.5)';
        img.style.cursor = 'zoom-out';
    } else {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'zoom-in';
    }
};

// ... KEEP THE PAPA.PARSE CORE ENGINE BELOW THIS LINE EXACTLY AS IT WAS ...

// --- THE SHIKARA CORE ENGINE ---
Papa.parse("./catalog.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const products = results.data.filter(item => item.Item); 
        
        // JOB 1: THE GRID
        const gridContainer = document.getElementById('catalog-container');
        if (gridContainer) {
            const limit = gridContainer.getAttribute('data-limit');
            let displayProducts = limit ? products.slice(0, parseInt(limit)) : products;

            let html = '';
            displayProducts.forEach(item => {
                html += `
                <div class="product-card">
                    <div class="image-container">
                        <a href="product.html?id=${item.ID}">
                            <img src="./static/${item.Image1}" alt="${item.Item}" class="product-image">
                        </a>
                        <div class="quick-view">
                            <a href="product.html?id=${item.ID}">View Details</a>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>${item.Item}</h3>
                        <div class="price">₹${item.Price}</div>
                    </div>
                </div>
                `;
            });
            gridContainer.innerHTML = html;
        }

        // JOB 2: THE SINGLE PRODUCT PAGE
        const detailContainer = document.getElementById('product-detail-container');
        if (detailContainer) {
            const urlParams = new URLSearchParams(window.location.search);
            const targetId = urlParams.get('id');
            const product = products.find(item => item.ID === targetId);

            if (product) {
                // Build thumbnail HTML
                let galleryHtml = '';
                if (product.Image1) galleryHtml += `<img src="./static/${product.Image1}" class="thumbnail" onclick="swapImage(this.src)">`;
                if (product.Image2) galleryHtml += `<img src="./static/${product.Image2}" class="thumbnail" onclick="swapImage(this.src)">`;
                if (product.Image3) galleryHtml += `<img src="./static/${product.Image3}" class="thumbnail" onclick="swapImage(this.src)">`;
                if (product.Image4) galleryHtml += `<img src="./static/${product.Image4}" class="thumbnail" onclick="swapImage(this.src)">`;

                // Inject the layout with the new Share button and Lightbox trigger
                detailContainer.innerHTML = `
                    <div class="product-detail-layout">
                        <div class="detail-image-box">
                            <div class="main-image-container" style="position: relative;">
                                <div class="floating-share" onclick="shareProduct('${product.Item}')" title="Share">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </div>
                                
                                <img src="./static/${product.Image1}" alt="${product.Item}" class="full-size-image" id="main-detail-image" onclick="openLightbox()" style="cursor: zoom-in;">
                            </div>
                            
                            <div class="thumbnail-gallery">
                                ${galleryHtml}
                            </div>
                        </div>
                        
                        <div class="detail-info-box">
                            <h1>${product.Item}</h1>
                            <div class="detail-price">₹${product.Price}</div>
                            <p class="detail-description">${product.Description}</p>
                            <div class="detail-sizes">Available Sizes: <strong>${product.Size}</strong></div>
                            
                            <a href="https://wa.me/910000000000?text=Hi Shikara! I want to buy the ${product.Item} (ID: ${product.ID})." 
                               class="buy-now-btn" target="_blank">
                               Buy via WhatsApp
                            </a>
                        </div>
                    </div>
                `;
            } else {
                detailContainer.innerHTML = `<h2>Product not found.</h2>`;
            }
        }

        const loader = document.getElementById('loader-container');
        if (loader) loader.style.display = 'none';
    }
});