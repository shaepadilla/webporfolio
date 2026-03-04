// app.js - updated with real product images from placeholder sources

// ----- GROCERY PRODUCT DATASET WITH IMAGE URLs -----
const groceryProducts = [
    // Fresh Produce
    { id: 101, name: "Organic Bananas", category: "Fresh Produce", price: 98, image: "https://www.croptrust.org/fileadmin/_processed_/c/1/csm_1249337589_f0fabec151_o_b427ad96a8.jpg", badge: "fair trade", unit: "bunch" },
    { id: 102, name: "Watermelon", category: "Fresh Produce", price: 110, image: "https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg?auto=compress&cs=tinysrgb&w=400", badge: "ripe", unit: "kg" },
    { id: 103, name: "Carrots", category: "Fresh Produce", price: 20, image: "https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=400", badge: "local", unit: "piece" },
    { id: 104, name: "Baby Spinach", category: "Fresh Produce", price: 20, image: "https://www.earthboundfarm.com/wp-content/uploads/2024/03/EBF-Baby-Spinach-5oz-featured-1980x1980.webp", badge: "organic", unit: "pack" },
    
    // Meat & Seafood
    { id: 201, name: "Chicken Breast", category: "Meat & Seafood", price: 65, image: "https://www.everydaycheapskate.com/wp-content/uploads/20250407-how-to-cook-boneless-skinless-chicken-breast-on-a-cutting-board-with-thyme-garlic-and-red-peppercorns.png", badge: "free-range", unit: "kg" },
    { id: 202, name: "Salmon Fillet", category: "Meat & Seafood", price: 125, image: "https://fishgalore.co.uk/cdn/shop/products/7.Salmonfillet.jpg?v=1587218972", badge: "wild caught", unit: "300g" },
    { id: 203, name: "Ground Beef", category: "Meat & Seafood", price: 150, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMSrWoWb6Q43m9l8KFilAiuMWO8uVm5zy5fw&s", badge: "grass-fed", unit: "400g" },
    
    // Dairy & Eggs
    { id: 301, name: "Fresh Eggs (12)", category: "Dairy & Eggs", price: 120, image: "https://carriageworks.com.au/wp-content/uploads/Hilltops-1.jpg", badge: "pasture raised", unit: "dozen" },
    { id: 302, name: "Whole Milk (1L)", category: "Dairy & Eggs", price: 139, image: "https://www.nestleprofessional.ph/sites/default/files/styles/np_product_detail/public/2023-01/NESTL%C3%89%C2%AE%20Fresh%20Milk%201L.png?itok=L6Ey2VqZ", badge: "organic", unit: "litre" },
    { id: 303, name: "Yogurt", category: "Dairy & Eggs", price: 198, image: "https://pacificbay.com.ph/cdn/shop/products/natural-yogurt-151920.jpg?v=1626937348", badge: "strained", unit: "litre" },
    { id: 304, name: "Cheddar", category: "Dairy & Eggs", price: 270, image: "https://d2j6dbq0eux0bg.cloudfront.net/images/31151001/3933781796.jpg", badge: "sharp", unit: "200g" },
    
    // Bakery
    { id: 401, name: "Bread Loaf", category: "Bakery", price: 98, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCvMvBll2kFRe95_mBtOfQQ8E8P614GsVL9A&s", badge: "fresh baked", unit: "each" },
    { id: 402, name: "Croissant", category: "Bakery", price: 30, image: "https://www.theflavorbender.com/wp-content/uploads/2020/05/French-Croissants-SM-2363.jpg", badge: "buttery", unit: "pack" },
    
    // Beverages
    { id: 501, name: "Ground Coffee", category: "Beverages", price: 167, image: "https://www.shutterstock.com/image-photo/coarsely-ground-coffee-beans-making-600nw-2625063953.jpg", badge: "Dark", unit: "330g" },
    { id: 502, name: "Coconut Water", category: "Beverages", price: 150, image: "https://www.organicauthority.com/wp-content/uploads/2025/01/220402_VitaCoco_Escalante_BK_5093_1-1-888x630.jpg", badge: "hydrating", unit: "1L" },
    { id: 503, name: "Orange Juice", category: "Beverages", price: 128, image: "https://cdn.smithbrothersfarms.com/media/0013924_simply-orange-pulp-free-juice-46-fl-oz.jpeg", badge: "fresh squeezed", unit: "750ml" },
    
    // Snacks
    { id: 601, name: "Dark Chocolate", category: "Snacks", price: 89, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBoJq_jGki9pARk9_eWbCoC9YKphZs-vKc5Q&s", badge: "72% cocoa", unit: "bar" },
    { id: 602, name: "Kettle Chips", category: "Snacks", price: 175, image: "https://www.thetakeout.com/images/95903ecb7789e41a49e0289a0185f7cd.jpg", badge: "sea salt", unit: "200g" },
    { id: 603, name: "Mixed Nuts", category: "Snacks", price: 120, image: "https://purehubnutrition.ph/cdn/shop/files/DeluxeMixedNuts500g.png?v=1772178037&width=1445", badge: "roasted", unit: "300g" },
    
    // Pantry Staples
    { id: 701, name: "Extra Virgin Olive Oil", category: "Pantry", price: 325, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEdKuQlKtNRhuMAhEREakkvmbNFK3EJNfF1Q&s", badge: "cold pressed", unit: "750ml" },
    { id: 702, name: "Quinoa (1kg)", category: "Pantry", price: 69-304, image: "https://www.themediterraneandish.com/wp-content/uploads/2025/09/TMD-How-to-Cook-Quinoa-Leads-04-Angles.jpg", badge: "organic", unit: "bag" },
    { id: 703, name: "Pasta (500g)", category: "Pantry", price: 90, image: "https://www.jessicagavin.com/wp-content/uploads/2020/07/how-to-cook-pasta-3-1200.jpg", badge: "organic", unit: "500g" },
    
    // Organic
    { id: 801, name: "Organic Honey", category: "Organic", price: 839.50, image: "https://us.nuxe.com/cdn/shop/articles/mag-1200x672-what-are-the-virtues-of-honey-and-other-treasures-of-the-hive-1.jpg?v=1751244173&width=2048", badge: "raw", unit: "1000g" },
    { id: 802, name: "Kale Chips", category: "Organic", price: 344.25, image: "https://leitesculinaria.com/wp-content/uploads/2013/04/kale-chips-1.jpg", badge: "gluten-free", unit: "135g" }
];

// ----- RENDER GROCERY PRODUCTS GROUPED BY CATEGORY -----
function renderGroupedGroceries() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    // group products by category
    const grouped = groceryProducts.reduce((acc, product) => {
        const cat = product.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {});

    // custom order for grocery departments
    const categoryOrder = [
        'Fresh Produce', 
        'Meat & Seafood', 
        'Dairy & Eggs', 
        'Bakery', 
        'Beverages', 
        'Snacks', 
        'Pantry', 
        'Organic'
    ];

    let htmlString = '';

    for (let cat of categoryOrder) {
        if (!grouped[cat] || grouped[cat].length === 0) continue;
        
        // category title (full width)
        htmlString += `<div class="category-section"><div class="category-title">${cat}</div></div>`;
        
        // products inside this category
        grouped[cat].forEach(prod => {
            htmlString += `
                <div class="product-card" data-id="${prod.id}">
                    ${prod.badge ? `<div class="product-badge">${prod.badge}</div>` : '<div style="height:1.5rem;"></div>'}
                    <div class="product-image">
                        <img src="${prod.image}" alt="${prod.name}" loading="lazy">
                    </div>
                    <div class="product-name">${prod.name}</div>
                    <div class="product-category-line"><i class="fas fa-tag"></i> ${prod.unit}</div>
                    <div class="product-price">₱${prod.price.toFixed(2)} <small>per ${prod.unit}</small></div>
                    <button class="add-button" data-id="${prod.id}"><i class="fas fa-cart-plus"></i> add to cart</button>
                </div>
            `;
        });
    }

    grid.innerHTML = htmlString;

    // attach event to all "add to cart" buttons
    document.querySelectorAll('.add-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prodId = parseInt(btn.dataset.id);
            const product = groceryProducts.find(p => p.id === prodId);
            
            // demo add to cart feedback
            alert(`🛒 Added "${product.name}" to your grocery cart`);
            
            // update cart count demo (increment)
            const cartSpan = document.querySelector('.cart-count');
            if (cartSpan) {
                let current = parseInt(cartSpan.textContent) || 0;
                cartSpan.textContent = current + 1;
            }
            
            // button animation
            btn.style.background = '#f9f871';
            setTimeout(() => btn.style.background = '', 200);
        });
    });
}

// ----- additional interactions -----
function attachCardHover() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-button') || e.target.closest('.add-button')) return;
            console.log('quick view product', card.dataset.id);
        });
    });
}

// ----- initialize on page load -----
window.addEventListener('DOMContentLoaded', () => {
    renderGroupedGroceries();
    attachCardHover();
    
    // reset cart count to 0 on fresh load
    const cartSpan = document.querySelector('.cart-count');
    if (cartSpan) cartSpan.textContent = '0';
});