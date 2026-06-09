// 1. Read the URL to see if a specific category was requested
const urlParams = new URLSearchParams(window.location.search);
const targetCategory = urlParams.get('category') || 'All';

// Show loader if present
const loader = document.getElementById('loader-container');
if (loader) loader.style.display = 'flex';

// 2. Fetch and Parse the CSV Database
Papa.parse('./catalog.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        try {
            // Remove any empty rows from the spreadsheet
            let products = results.data.filter(item => item && item.Item);
            const container = document.getElementById('catalog-container');

            // Stop the script if the container is missing
            if (!container) {
                if (loader) loader.style.display = 'none';
                return;
            }

            // 3. Filter the products based on the URL (e.g., ?category=Men)
            if (targetCategory !== 'All') {
                products = products.filter(item => (item.Category || '').toLowerCase() === targetCategory.toLowerCase());
            }

            // 4. Check if the page requested a limit (for the homepage)
            const limitAttr = container.getAttribute('data-limit');
            if (limitAttr) {
                const n = parseInt(limitAttr, 10);
                if (!isNaN(n) && n > 0) products = products.slice(0, n);
            }

            // 5. Build the HTML
            let html = '';
        products.forEach(item => {
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
        });
        
        // Inject the products into the grid
        container.innerHTML = html;
        
        // HIDE THE LOADER ONCE PRODUCTS ARE INJECTED
        const loader = document.getElementById('loader-container');
        if (loader) {
            loader.style.display = 'none';
        }

            // 6. Update the page title dynamically if on a category page
            const pageTitle = document.getElementById('dynamic-title');
            if (pageTitle && targetCategory !== 'All') {
                pageTitle.innerText = targetCategory + ' Collection';
            }
        } catch (err) {
            console.error('Error processing catalog:', err);
            const container = document.getElementById('catalog-container');
            if (container) container.innerHTML = '<p>Failed to load products.</p>';
        } finally {
            if (loader) loader.style.display = 'none';
        }
    },
    error: function(err) {
        console.error('Failed to load CSV:', err);
        const container = document.getElementById('catalog-container');
        if (container) container.innerHTML = '<p>Failed to load products.</p>';
        if (loader) loader.style.display = 'none';
    }
});
