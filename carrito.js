document.addEventListener('DOMContentLoaded', function() {
    const cartPageContainer = document.getElementById('cart-page-container');
    const cartPageTotal = document.getElementById('cart-page-total');
    const cartSummary = document.getElementById('cart-summary');

    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    const saveCart = () => {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        // Disparamos un evento para que el contador del header se actualice
        window.dispatchEvent(new Event('storage'));
    };

    const updateCartPage = () => {
        cartPageContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartPageContainer.innerHTML = `
                <div class="text-center p-12">
                    <p class="text-xl text-gray-500 mb-4">Tu carrito está vacío.</p>
                    <a href="productos.html" class="inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
                        Explorar Productos
                    </a>
                </div>
            `;
            cartSummary.classList.add('hidden');
        } else {
            cartSummary.classList.remove('hidden');
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-b border-gray-200';
                itemElement.innerHTML = `
                    <div class="flex items-center gap-6 flex-1">
                        <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg shadow-md">
                        <div class="flex-1">
                            <h3 class="text-lg font-bold text-gray-800">${item.name}</h3>
                            <p class="text-gray-600">$${item.price.toFixed(2)} USD</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center border border-gray-300 rounded-md">
                            <button class="px-3 py-1 text-lg font-bold" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span class="px-4 py-1 text-lg">${item.quantity}</span>
                            <button class="px-3 py-1 text-lg font-bold" onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                        <p class="font-bold text-lg w-28 text-right">$${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="text-red-500 hover:text-red-700 text-2xl" onclick="removeFromCartPage('${item.id}')">&times;</button>
                    </div>
                `;
                cartPageContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }

        if (cartPageTotal) {
            cartPageTotal.textContent = `$${total.toFixed(2)} USD`;
        }
    };

    window.removeFromCartPage = (id) => {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartPage();
    };

    window.updateQuantity = (id, change) => {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCartPage(id);
            } else {
                saveCart();
                updateCartPage();
            }
        }
    };

    // Inicializar la vista de la página del carrito
    updateCartPage();

    // --- Lógica para Finalizar Compra ---
    const checkoutLink = document.getElementById('checkout-link');
    if (checkoutLink) {
        checkoutLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir la navegación inmediata

            // Crear un resumen del pedido
            let orderSummary = "Hola, estoy interesado en comprar los siguientes productos:\n\n";
            let total = 0;
            cart.forEach(item => {
                orderSummary += `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
                total += item.price * item.quantity;
            });
            orderSummary += `\nTotal del Pedido: $${total.toFixed(2)} USD`;

            // Guardar el resumen en localStorage para que la página de contacto lo lea
            const checkoutData = {
                subject: 'Solicitud de cotización de equipo',
                message: orderSummary
            };
            localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

            // Redirigir a la página de contacto
            window.location.href = checkoutLink.href;
        });
    }
});