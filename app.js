// app.js
// Data Structure
let users = JSON.parse(localStorage.getItem('users')) || [];
let services = JSON.parse(localStorage.getItem('services')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Auth System
function register(name, email, password) {
    if(users.some(u => u.email === email)) {
        alert('Email/nomor WA sudah terdaftar!');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: 'user',
        joined: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    login(email, password);
}

function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('Login gagal! Periksa kembali credentials Anda');
    }
}

// Service Management
function addService(name, price, description) {
    const newService = {
        id: Date.now(),
        name,
        price,
        description,
        createdAt: new Date().toISOString()
    };
    
    services.push(newService);
    localStorage.setItem('services', JSON.stringify(services));
    renderServices();
}

// Order System
function createOrder(serviceId, paymentData) {
    const newOrder = {
        id: Date.now().toString(),
        userId: currentUser.id,
        serviceId,
        ...paymentData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        adminNotes: '',
        deliveryFile: null
    };
    
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Admin Functions
function updateOrderStatus(orderId, status, file = null) {
    const order = orders.find(o => o.id === orderId);
    if(order) {
        order.status = status;
        if(file) order.deliveryFile = file;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

// UI Rendering
function renderServices() {
    const container = document.querySelector('.services-container');
    container.innerHTML = services.map(service => `
        <div class="service-card">
            <h3>${service.name}</h3>
            <p class="price">Rp ${service.price.toLocaleString()}</p>
            <p>${service.description}</p>
            <button onclick="showOrderModal(${service.id})">Pesan Sekarang</button>
        </div>
    `).join('');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if(window.location.pathname.includes('index.html')) {
        renderServices();
        updateAuthUI();
    }
    
    if(window.location.pathname.includes('owner.html')) {
        if(!currentUser || currentUser.role !== 'admin') {
            window.location.href = 'login.html';
        }
        renderAdminOrders();
        renderAdminServices();
    }
});

// Admin Credentials (Hardcoded for demo)
const ADMIN_CREDENTIALS = {
    email: "actzy",
    password: "3Z^Yk~HaKd6M-spj>PoC"
};

// Initialize Demo Data
if(services.length === 0) {
    addService('Pembuatan Script Custom', 500000, 'Script sesuai kebutuhan dengan garansi 1 bulan');
    addService('Edit Script Existing', 250000, 'Perbaikan dan optimasi script yang sudah ada');
                                  }
