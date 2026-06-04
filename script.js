        // 1. Fetch and Parse the CSV Database
        // 1. Fetch and Parse the CSV Database
        Papa.parse("./catalog.csv", {  // Note the ./ added here
            download: true,
            header: true,
            complete: function(results) {
                const products = results.data;
                const container = document.getElementById('catalog-container');
                let html = '';

                products.forEach(item => {
                    if(!item.Item) return; 

                    // Note the ./ added before the static folder path
                    html += `
                    <div class="product-card" data-category="${item.Category}">
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
                
                container.innerHTML = html;
            }
        });

        // 2. The Filtering Logic
        function filterCategory(targetCategory) {
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category').toLowerCase();
                if (targetCategory === 'All' || cardCategory === targetCategory.toLowerCase()) {
                    card.style.display = 'block'; // Show item
                } else {
                    card.style.display = 'none';  // Hide item
                }
            });
        }