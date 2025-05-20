// app.js
class CodeStore {
    constructor() {
        this.services = JSON.parse(localStorage.getItem('services')) || [];
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.init();
    }

    init() {
        this.initEventListeners();
        this.checkAuth();
        this.renderServices();
        this.renderOrders();
    }

    initEventListeners() {
        // Login Form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Order Form
        document.getElementById('orderForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleOrderSubmission();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Admin login
        if(username === 'actzy' && password === '3Z^Yk~HaKd6M-spj>PoC') {
            this.currentUser = { 
                id: 'admin',
                name: 'Admin',
                role: 'admin' 
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            window.location.href = 'owner.html';
            return;
        }

        // User login
        const user = this.users.find(u => u.username === username && u.password === password);
        if(user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            alert('Login gagal! Periksa kembali credentials Anda');
        }
    }

    handleOrderSubmission() {
        const paymentProof = document.getElementById('paymentProof').files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const newOrder = {
                id: Date.now(),
                userId: this.currentUser?.id,
                serviceId: '1',
                paymentProof: e.target.result,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            this.orders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(this.orders));
            alert('Pesanan berhasil dikirim!');
            this.closeModal();
        };

        reader.readAsDataURL(paymentProof);
    }

    renderServices() {
        const servicesGrid = document.querySelector('.services-grid');
        if(servicesGrid) {
            servicesGrid.innerHTML = this.services.map(service => `
                <div class="service-card">
                    <h3>${service.name}</h3>
                    <p class="price">Rp ${service.price.toLocaleString()}</p>
                    <p>${service.description}</p>
                    <button class="cta-btn" onclick="store.showOrderModal('${service.id}')">
                        Pesan Sekarang
                    </button>
                </div>
            `).join('');
        }
    }

    renderOrders() {
        if(document.getElementById('ordersList')) {
            const ordersList = document.getElementById('ordersList');
            ordersList.innerHTML = this.orders.map(order => `
                <div class="order-item ${order.status}">
                    <div class="order-header">
                        <span>#${order.id}</span>
                        <span class="status-badge ${order.status}">${order.status}</span>
                    </div>
                    <div class="order-actions">
                        <button onclick="store.approveOrder('${order.id}')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="danger" onclick="store.rejectOrder('${order.id}')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                        <input type="file" 
                               onchange="store.uploadFile('${order.id}', this)" 
                               class="file-input">
                    </div>
                </div>
            `).join('');
        }
    }

    approveOrder(orderId) {
        const order = this.orders.find(o => o.id == orderId);
        if(order) {
            order.status = 'completed';
            localStorage.setItem('orders', JSON.stringify(this.orders));
            this.renderOrders();
        }
    }

    // ... (Methods lainnya)
}

const store = new CodeStore();

// Public functions
window.showOrderModal = (serviceId) => {
    document.getElementById('orderModal').style.display = 'block';
};

window.closeModal = () => {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
};
