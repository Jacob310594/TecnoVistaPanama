document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica de la Navegación Móvil ---
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        // Toggle para mostrar/ocultar el menú móvil
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Cierra el menú móvil al hacer clic en un enlace (función global)
    window.closeMenu = function() {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }

    // --- Lógica de las Pestañas (Tabs) de la Galería ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                // Desactivar todos los botones y ocultar todos los contenidos
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });
                tabButtons.forEach(btn => {
                    btn.classList.remove('active-tab');
                });

                // Activar el botón clicado y mostrar el contenido
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                }
                button.classList.add('active-tab');
            });
        });
    }

    // --- Lógica del Formulario de Contacto ---
    const contactForm = document.getElementById('contact-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    let isCheckoutSubmission = false; // Bandera para identificar si es un pedido

    if (contactForm && confirmationMessage) {
        // --- INICIO: Lógica para rellenar formulario desde el carrito ---
        const checkoutDataString = localStorage.getItem('checkoutData');
        if (checkoutDataString) {
            const checkoutData = JSON.parse(checkoutDataString);
            
            // Rellenar los campos del formulario
            const asuntoSelect = document.getElementById('asunto');
            const mensajeTextarea = document.getElementById('mensaje');
            
            if (asuntoSelect) asuntoSelect.value = checkoutData.subject;
            if (mensajeTextarea) mensajeTextarea.value = checkoutData.message;
            isCheckoutSubmission = true; // Marcamos que esta sesión es para una compra

            // Limpiar los datos para que no se reutilicen
            localStorage.removeItem('checkoutData');
        }
        // --- FIN: Lógica para rellenar formulario desde el carrito ---

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;

            // Simulación del envío de datos
            setTimeout(() => {
                confirmationMessage.textContent = `¡Mensaje enviado! Gracias por contactarnos, ${nombre}. Te responderemos a la brevedad.`;
                confirmationMessage.classList.remove('hidden');
                confirmationMessage.classList.add('bg-green-500/20', 'text-green-300');
                
                contactForm.reset();

                // --- INICIO: Lógica para vaciar el carrito después de la compra ---
                if (isCheckoutSubmission) {
                    window.cart = []; // Usa la variable global del carrito
                    window.saveCart(); // Usa la función global para guardar
                    window.updateCartView(); // Usa la función global para actualizar la vista
                    isCheckoutSubmission = false; // Resetea la bandera
                }
                // --- FIN: Lógica para vaciar el carrito después de la compra ---

                setTimeout(() => {
                    confirmationMessage.classList.add('hidden');
                }, 5000);
            }, 500); 
        });
    }

    // --- Lógica del Lightbox para la Galería ---
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const clickableImages = document.querySelectorAll('.tab-content img, .lightbox-trigger');

    if (lightboxOverlay && clickableImages.length > 0) {
        clickableImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxOverlay.classList.remove('hidden');
            });
        });

        const closeLightbox = () => {
            lightboxOverlay.classList.add('hidden');
            lightboxImg.src = ""; 
        };

        lightboxClose.addEventListener('click', closeLightbox);

        lightboxOverlay.addEventListener('click', (event) => {
            if (event.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }

    // --- Lógica de la Galería de Imágenes de Producto (Función Global) ---
    window.changeImage = function(element, newSrc) {
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) {
            mainImage.src = newSrc;
        }
        // Quita el borde de todas las miniaturas
        document.querySelectorAll('.thumbnail-image').forEach(img => {
            img.classList.remove('border-primary');
            img.classList.add('border-transparent');
        });
        // Añade el borde a la miniatura clicada
        element.classList.remove('border-transparent');
        element.classList.add('border-primary');
    }

    // --- Lógica del Carrito de Compras ---
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    window.cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // Función para guardar el carrito en localStorage
    window.saveCart = () => {
        localStorage.setItem('shoppingCart', JSON.stringify(window.cart));
    };

    // Función para actualizar la vista del carrito
    window.updateCartView = () => {
        // Limpiar contenedor
        cartItemsContainer.innerHTML = '';

        let total = 0;
        let totalItems = 0;

        if (window.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-400 text-center">Tu carrito está vacío.</p>';
        } else {
            window.cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'flex items-center justify-between gap-4 py-3 border-b border-gray-700';
                itemElement.innerHTML = `
                    <div class="flex items-center gap-4">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
                        <div>
                            <h4 class="font-semibold">${item.name}</h4>
                            <p class="text-sm text-gray-400">$${item.price.toFixed(2)} USD x ${item.quantity}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                         <p class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="text-red-500 hover:text-red-400" onclick="removeFromCart('${item.id}')">&times;</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
                totalItems += item.quantity;
            });
        }

        // Actualizar total y contador
        cartTotal.textContent = `$${total.toFixed(2)} USD`;
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('hidden', totalItems === 0);
    };

    // Función para añadir al carrito (global)
    window.addToCart = (id, name, price, image, buttonElement) => {
        const existingItem = window.cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            window.cart.push({ id, name, price, image, quantity: 1 });
        }
        window.saveCart();
        window.updateCartView();

        // --- INICIO: Lógica de confirmación visual en el botón ---
        if (buttonElement) {
            // Guardar el estado original del botón
            const originalText = buttonElement.innerHTML;
            const originalClasses = buttonElement.className;

            // Cambiar a estado de "Añadido"
            buttonElement.innerHTML = `✔ ¡Añadido!`;
            buttonElement.className = originalClasses.replace('bg-primary', 'bg-green-500').replace('hover:bg-blue-600', 'hover:bg-green-600');
            buttonElement.disabled = true; // Deshabilitar temporalmente

            // Después de mostrar la confirmación por 1.5 segundos, redirigir al carrito
            setTimeout(() => {
                window.location.href = 'carrito.html';
            }, 1500);
        }
        // --- FIN: Lógica de confirmación visual en el botón ---
    };

    // Función para remover del carrito (global)
    window.removeFromCart = (id) => {
        const itemIndex = window.cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            window.cart.splice(itemIndex, 1);
        }
        window.saveCart();
        window.updateCartView();
    };

    // Event Listeners para abrir/cerrar el modal del carrito
    if (cartButton && cartModal && closeCartButton) {
        cartButton.addEventListener('click', () => {
            window.location.href = 'carrito.html'; // Redirigir en lugar de abrir modal
        });

        const closeCart = () => {
            cartModal.classList.add('hidden');
        };

        closeCartButton.addEventListener('click', closeCart);

        cartModal.addEventListener('click', (event) => {
            if (event.target === cartModal) {
                closeCart();
            }
        });
    }

    // Escuchar cambios en el storage para actualizar el contador en todas las pestañas
    window.addEventListener('storage', () => {
        window.cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        window.updateCartView();
    });
    // Inicializar la vista del carrito al cargar la página
    window.updateCartView();
});
