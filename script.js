
        // JavaScript for the online ordering system
        document.addEventListener('DOMContentLoaded', function() {
            const cart = [];
            const cartItemsEl = document.getElementById('cart-items');
            const cartTotalEl = document.getElementById('cart-total');
            const checkoutBtn = document.getElementById('checkout-btn');
            const orderForm = document.getElementById('order-form');
            const orderFormData = document.getElementById('order-form-data');
            const orderConfirmation = document.getElementById('order-confirmation');
            const backToMenuBtn = document.getElementById('back-to-menu');
            const orderSummaryItems = document.getElementById('order-summary-items');
            const orderSubtotal = document.getElementById('order-subtotal');
            const orderTotal = document.getElementById('order-total');
            const deliveryTimeSelect = document.getElementById('delivery-time');
            const specificTimeGroup = document.getElementById('specific-time-group');
            
            // Add to cart functionality
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const name = this.getAttribute('data-name');
                    const price = parseFloat(this.getAttribute('data-price'));
                    
                    // Check if item already in cart
                    const existingItem = cart.find(item => item.id === id);
                    
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push({
                            id,
                            name,
                            price,
                            quantity: 1
                        });
                    }
                    
                    updateCart();
                });
            });
            
            // Update cart display
            function updateCart() {
                if (cart.length === 0) {
                    cartItemsEl.innerHTML = '<p>Your cart is empty</p>';
                    checkoutBtn.disabled = true;
                } else {
                    cartItemsEl.innerHTML = '';
                    let total = 0;
                    
                    cart.forEach(item => {
                        const itemEl = document.createElement('div');
                        itemEl.className = 'cart-item';
                        itemEl.innerHTML = `
                            <div class="cart-item-info">
                                <h4>${item.name}</h4>
                                <p>$${item.price.toFixed(2)}</p>
                            </div>
                            <div class="cart-item-controls">
                                <div class="quantity-control">
                                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                                </div>
                                <button class="remove-item" data-id="${item.id}">Remove</button>
                            </div>
                        `;
                        cartItemsEl.appendChild(itemEl);
                        
                        total += item.price * item.quantity;
                    });
                    
                    // Add event listeners for quantity controls
                    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
                        button.addEventListener('click', function() {
                            const id = this.getAttribute('data-id');
                            const item = cart.find(item => item.id === id);
                            
                            if (item.quantity > 1) {
                                item.quantity--;
                            } else {
                                // Remove item if quantity reaches 0
                                const index = cart.findIndex(item => item.id === id);
                                cart.splice(index, 1);
                            }
                            
                            updateCart();
                        });
                    });
                    
                    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
                        button.addEventListener('click', function() {
                            const id = this.getAttribute('data-id');
                            const item = cart.find(item => item.id === id);
                            item.quantity++;
                            updateCart();
                        });
                    });
                    
                    document.querySelectorAll('.remove-item').forEach(button => {
                        button.addEventListener('click', function() {
                            const id = this.getAttribute('data-id');
                            const index = cart.findIndex(item => item.id === id);
                            cart.splice(index, 1);
                            updateCart();
                        });
                    });
                    
                    checkoutBtn.disabled = false;
                }
                
                cartTotalEl.textContent = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
            }
            
            // Delivery time selection
            deliveryTimeSelect.addEventListener('change', function() {
                if (this.value === 'specific') {
                    specificTimeGroup.style.display = 'block';
                } else {
                    specificTimeGroup.style.display = 'none';
                }
            });
            
            // Checkout button
            checkoutBtn.addEventListener('click', function() {
                document.querySelector('#cart').scrollIntoView({ behavior: 'smooth' });
                orderForm.style.display = 'block';
            });
            
            // Order form submission
            orderFormData.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const address = document.getElementById('address').value;
                const deliveryTime = document.getElementById('delivery-time').value;
                const specificTime = document.getElementById('specific-time').value;
                const payment = document.getElementById('payment').value;
                const notes = document.getElementById('notes').value;
                
                // Calculate delivery time text
                let deliveryText = '';
                switch(deliveryTime) {
                    case 'asap':
                        deliveryText = 'As soon as possible';
                        break;
                    case '30':
                        deliveryText = 'Within 30 minutes';
                        break;
                    case '60':
                        deliveryText = 'Within 1 hour';
                        break;
                    case '90':
                        deliveryText = 'Within 1.5 hours';
                        break;
                    case '120':
                        deliveryText = 'Within 2 hours';
                        break;
                    case 'specific':
                        deliveryText = `At ${new Date(specificTime).toLocaleString()}`;
                        break;
                }
                
                // Calculate payment method text
                let paymentText = '';
                switch(payment) {
                    case 'cash':
                        paymentText = 'Cash on Delivery';
                        break;
                    case 'card':
                        paymentText = 'Credit/Debit Card';
                        break;
                    case 'online':
                        paymentText = 'Online Payment';
                        break;
                }
                
                // Calculate totals
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const deliveryFee = 2.99;
                const total = subtotal + deliveryFee;
                
                // Update order confirmation page
                document.getElementById('customer-name').textContent = `Name: ${name}`;
                document.getElementById('customer-phone').textContent = `Phone: ${phone}`;
                document.getElementById('customer-address').textContent = `Address: ${address}`;
                document.getElementById('delivery-info').textContent = `Delivery Time: ${deliveryText}`;
                document.getElementById('payment-info').textContent = `Payment Method: ${paymentText}`;
                
                // Update order summary
                orderSummaryItems.innerHTML = '';
                cart.forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'order-item';
                    itemEl.innerHTML = `
                        <span>${item.name} (${item.quantity}x)</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    `;
                    orderSummaryItems.appendChild(itemEl);
                });
                
                orderSubtotal.textContent = `$${subtotal.toFixed(2)}`;
                orderTotal.textContent = `$${total.toFixed(2)}`;
                
                // In a real application, you would send this data to a server
                const formData = {
                    name,
                    email,
                    phone,
                    address,
                    deliveryTime: deliveryText,
                    payment: paymentText,
                    notes,
                    items: cart,
                    subtotal,
                    deliveryFee,
                    total
                };
                
                console.log('Order submitted:', formData);
                
                // Show confirmation
                orderForm.style.display = 'none';
                orderConfirmation.style.display = 'block';
                
                // Clear cart
                cart.length = 0;
                updateCart();
                
                // Reset form
                this.reset();
                specificTimeGroup.style.display = 'none';
            });
            
            // Back to menu button
            backToMenuBtn.addEventListener('click', function() {
                orderConfirmation.style.display = 'none';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
        // At the top of your script, add:
const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
const orderHistorySection = document.getElementById('order-history');
const orderHistoryContainer = document.getElementById('order-history-container');

// Modify the form submission handler to save orders:
orderFormData.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // ... (keep all your existing form data collection code)
    
    // Create order object
    const order = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        name,
        email,
        phone,
        address,
        deliveryTime: deliveryText,
        payment: paymentText,
        notes,
        items: [...cart], // Create a copy of the cart
        subtotal,
        deliveryFee,
        total
    };
    
    // Add to order history
    orderHistory.unshift(order); // Add new order to beginning of array
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    // ... (keep the rest of your existing submission code)
    
    // Show order history after submission
    displayOrderHistory();
});

// Database simulation using localStorage
const database = {
    orders: JSON.parse(localStorage.getItem('orders')) || [],
    
    saveOrder: function(order) {
        this.orders.unshift(order);
        localStorage.setItem('orders', JSON.stringify(this.orders));
    },
    
    getOrders: function() {
        return this.orders;
    },
    
    getCakeOrders: function() {
        return this.orders.filter(order => 
            order.items.some(item => item.id >= 1 && item.id <= 12) // Cake IDs from your HTML
        );
    },
    
    getPizzaOrders: function() {
        return this.orders.filter(order => 
            order.items.some(item => item.id >= 6 && item.id <= 17) // Pizza IDs from your HTML
        );
    }
};

// Order History Functions
function displayOrderHistory() {
    const allOrdersContainer = document.getElementById('all-orders-container');
    const cakeOrdersContainer = document.getElementById('cake-orders-container');
    const pizzaOrdersContainer = document.getElementById('pizza-orders-container');
    
    // Clear containers
    allOrdersContainer.innerHTML = '';
    cakeOrdersContainer.innerHTML = '';
    pizzaOrdersContainer.innerHTML = '';
    
    // Get orders from database
    const allOrders = database.getOrders();
    const cakeOrders = database.getCakeOrders();
    const pizzaOrders = database.getPizzaOrders();
    
    // Display all orders
    if (allOrders.length === 0) {
        allOrdersContainer.innerHTML = '<p>No orders found</p>';
    } else {
        allOrders.forEach(order => renderOrderCard(order, allOrdersContainer));
    }
    
    // Display cake orders
    if (cakeOrders.length === 0) {
        cakeOrdersContainer.innerHTML = '<p>No cake orders found</p>';
    } else {
        cakeOrders.forEach(order => renderOrderCard(order, cakeOrdersContainer));
    }
    
    // Display pizza orders
    if (pizzaOrders.length === 0) {
        pizzaOrdersContainer.innerHTML = '<p>No pizza orders found</p>';
    } else {
        pizzaOrders.forEach(order => renderOrderCard(order, pizzaOrdersContainer));
    }
    
    // Show order history section
    document.getElementById('order-history').style.display = 'block';
}

function renderOrderCard(order, container) {
    const orderEl = document.createElement('div');
    orderEl.className = 'order-card';
    
    // Determine order types
    const hasCakes = order.items.some(item => item.id >= 1 && item.id <= 12);
    const hasPizzas = order.items.some(item => item.id >= 6 && item.id <= 17);
    
    orderEl.innerHTML = `
        <div class="order-header">
            <div>
                <span class="order-id">Order #${order.id.substring(0, 8)}</span>
                ${hasCakes ? '<span class="order-type cake">Cakes</span>' : ''}
                ${hasPizzas ? '<span class="order-type pizza">Pizzas</span>' : ''}
            </div>
            <div>
                <span class="order-date">${order.date}</span>
                <span class="order-total">Rs ${order.total.toFixed(2)}</span>
            </div>
        </div>
        <div class="order-items">
            ${order.items.slice(0, 3).map(item => `
                <div class="order-item">
                    <span>${item.name} (${item.quantity}x)</span>
                    <span>Rs ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
            ${order.items.length > 3 ? `<p>+ ${order.items.length - 3} more items</p>` : ''}
        </div>
        <button class="view-details" data-order-id="${order.id}">View Details</button>
        <div class="order-details" id="details-${order.id}">
            <h4>Delivery Information</h4>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Delivery Time:</strong> ${order.deliveryTime}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
            
            <h4 style="margin-top: 15px;">Order Items</h4>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} (${item.quantity}x)</span>
                        <span>Rs ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                <div class="order-item">
                    <span><strong>Subtotal:</strong></span>
                    <span>Rs ${order.subtotal.toFixed(2)}</span>
                </div>
                <div class="order-item">
                    <span><strong>Delivery Fee:</strong></span>
                    <span>Rs ${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div class="order-item" style="font-weight: bold;">
                    <span><strong>Total:</strong></span>
                    <span>Rs ${order.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(orderEl);
    
    // Add event listener for view details button
    orderEl.querySelector('.view-details').addEventListener('click', function() {
        const detailsEl = document.getElementById(`details-${order.id}`);
        if (detailsEl.style.display === 'block') {
            detailsEl.style.display = 'none';
            this.textContent = 'View Details';
        } else {
            detailsEl.style.display = 'block';
            this.textContent = 'Hide Details';
        }
    });
}

// Tab Switching Functionality
document.querySelectorAll('.history-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs
        document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.history-tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(`${tabId}-orders`).classList.add('active');
    });
});

// Modify the form submission handler
orderFormData.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // ... (keep all your existing form data collection code)
    
    // Create order object
    const order = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        name,
        email,
        phone,
        address,
        deliveryTime: deliveryText,
        paymentMethod: paymentText,
        notes,
        items: [...cart], // Create a copy of the cart
        subtotal,
        deliveryFee,
        total
    };
    
    // Save to database
    database.saveOrder(order);
    
    // ... (keep the rest of your existing submission code)
    
    // Show order history after submission
    displayOrderHistory();
});

// Initialize order history when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (database.getOrders().length > 0) {
        displayOrderHistory();
    }
});

// Add this to your DOMContentLoaded event listener at the bottom:
// Show order history if there are any orders
if (orderHistory.length > 0) {
    displayOrderHistory();
}