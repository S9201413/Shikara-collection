// Fetch and Parse the CSV Database
Papa.parse("./catalog.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const products = results.data;
        const container = document.getElementById('catalog-container');
        
        // Read the rules from the HTML file
        const pageCategory = container.getAttribute('data-category');
        const itemLimit = parseInt(container.getAttribute('data-limit')) || 9999; 

        let html = '';
        let displayCount = 0;

        products.forEach(item => {
            if(!item.Item) return; // Skip blank rows
            if(displayCount >= itemLimit) return; // Stop if we hit the limit

            // Filter logic: Show if category matches, OR if page is set to "All"
            if (pageCategory === 'All' || item.Category.toLowerCase() === pageCategory.toLowerCase()) {
                
                html += `
                <div class="product-card">
                    <div class="image-container">
                        <img src="./static/${item.Image}" alt="${item.Item}" class="product-image">
                        <div class="quick-view">
                            <a href="https://wa.me/910000000000?text=Hi Shikara! I am interested in the ${item.Item} (Size: ${item.Size})." target="_blank">Inquire Now</a>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="category">${item.Category}</div>
                        <h3>${item.Item}</h3>
                        <div class="price">₹${item.Price}</div>
                        <div class="size">Size: ${item.Size}</div>
                    </div>
                </div>
                `;
                displayCount++;
            }
        });
        
        container.innerHTML = html;
    }
});
