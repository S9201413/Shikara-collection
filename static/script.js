// Universal Shikara Engine
Papa.parse("./catalog.csv", {
    download: true,
    header: true,
    complete: function(results) {
        // Filter out empty rows
        const products = results.data.filter(item => item.Item); 
        
        // --- JOB 1: BUILD THE GRID (Homepage & Shop Page) ---
        const gridContainer = document.getElementById('catalog-container');
        if (gridContainer) {
            const limit = gridContainer.getAttribute('data-limit');
            let displayProducts = limit ? products.slice(0, parseInt(limit)) : products;

            let html = '';
            displayProducts.forEach(item => {
                // Notice the link now points to product.html?id=M001
                html += `
                <div class="product-card">
                    <div class="image-container">
                        <a href="product.html?id=${item.ID}">
                            <img src="./static/${item.Image}" alt="${item.Item}" class="product-image">
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

        // --- JOB 2: BUILD THE SINGLE PRODUCT PAGE ---
        const detailContainer = document.getElementById('product-detail-container');
        if (detailContainer) {
            // Read the ID from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const targetId = urlParams.get('id');

            // Find the exact product in the database
            const product = products.find(item => item.ID === targetId);

            if (product) {
                // Build the single product layout
                detailContainer.innerHTML = `
                    <div class="product-detail-layout">
                        <div class="detail-image-box">
                            <img src="./static/${product.Image}" alt="${product.Item}" class="full-size-image">
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

        // Hide loader globally
        const loader = document.getElementById('loader-container');
        if (loader) loader.style.display = 'none';
    }
});