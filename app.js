// app.js
class ContentManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.events = JSON.parse(localStorage.getItem('events')) || [];
        this.init();
    }

    init() {
        this.renderProducts();
        this.renderEvents();
        this.initSwiper();
    }

    // Product Management
    saveProduct() {
        const newProduct = {
            id: Date.now(),
            title: document.getElementById('productTitle').value,
            price: document.getElementById('productPrice').value,
            description: document.getElementById('productDesc').value,
            images: this.readFilesAsDataURL(document.getElementById('productImages').files),
            createdAt: new Date().toISOString()
        };

        this.products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(this.products));
        this.renderProducts();
    }

    // Event Management
    saveEvent() {
        const newEvent = {
            id: Date.now(),
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            description: document.getElementById('eventDesc').value,
            banner: this.readFileAsDataURL(document.getElementById('eventBanner').files[0]),
            color: document.getElementById('eventColor').value,
            link: document.getElementById('eventLink').value,
            createdAt: new Date().toISOString()
        };

        this.events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(this.events));
        this.renderEvents();
    }

    // Rendering
    renderProducts() {
        const grid = document.getElementById('productGrid');
        grid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image" 
                     style="background-image: url('${product.images[0]}')"></div>
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <div class="price-tag">Rp ${Number(product.price).toLocaleString()}</div>
                    <button class="cta-btn" onclick="addToCart('${product.id}')">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderEvents() {
        const swiperWrapper = document.getElementById('eventBanner');
        swiperWrapper.innerHTML = this.events.map(event => `
            <div class="swiper-slide event-slide" 
                 style="background: ${event.color} url('${event.banner}')">
                <div class="event-content">
                    <div class="event-badge">
                        <i class="fas fa-calendar-day"></i>
                        ${new Date(event.date).toLocaleDateString()}
                    </div>
                    <h2>${event.title}</h2>
                    <p>${event.description}</p>
                    <a href="${event.link}" class="cta-btn" target="_blank">
                        Join Event <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `).join('');
        
        this.initSwiper();
    }

    // Helper functions
    readFileAsDataURL(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    initSwiper() {
        new Swiper('.swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            autoplay: {
                delay: 5000,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }
}

const contentManager = new ContentManager();
