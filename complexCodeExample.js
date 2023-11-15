/**
 * Filename: complexCodeExample.js
 * 
 * Description: This complex JavaScript code demonstrates a library for managing a virtual store.
 * It includes various modules such as product management, user authentication, shopping cart, and order processing.
 * The code showcases advanced JavaScript concepts, design patterns, and functional programming techniques.
 *
 * Note: This is a hypothetical implementation for demonstration purposes and may not cover all possible cases.
 */

// Import required modules
const { uuid } = require('uuidv4');
const bcrypt = require('bcrypt');
const moment = require('moment');

// Product Management Module
const productService = (() => {
    const products = [];

    function addProduct(name, price, quantity) {
        products.push({ id: uuid(), name, price, quantity });
    }

    function removeProduct(productId) {
        const index = products.findIndex((product) => product.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
        }
    }

    function getProduct(productId) {
        return products.find((product) => product.id === productId);
    }

    function getAllProducts() {
        return products;
    }

    return {
        addProduct,
        removeProduct,
        getProduct,
        getAllProducts,
    };
})();

// User Authentication Module
const authService = (() => {
    const users = [];

    function registerUser(username, password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        users.push({ id: uuid(), username, password: hashedPassword });
    }

    function authenticateUser(username, password) {
        const user = users.find((user) => user.username === username);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }

    return {
        registerUser,
        authenticateUser,
    };
})();

// Shopping Cart Module
const cartService = (() => {
    const carts = [];

    function createCart(userId) {
        const cart = { id: uuid(), userId, items: [] };
        carts.push(cart);
        return cart;
    }

    function getCart(cartId) {
        return carts.find((cart) => cart.id === cartId);
    }

    function addToCart(cartId, productId, quantity = 1) {
        const cart = getCart(cartId);
        if (cart) {
            const item = cart.items.find((item) => item.productId === productId);
            if (item) {
                item.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }
    }

    function removeFromCart(cartId, productId, quantity = 1) {
        const cart = getCart(cartId);
        if (cart) {
            const item = cart.items.find((item) => item.productId === productId);
            if (item) {
                item.quantity -= quantity;
                if (item.quantity <= 0) {
                    const index = cart.items.indexOf(item);
                    cart.items.splice(index, 1);
                }
            }
        }
    }

    function getCartTotalPrice(cartId) {
        let total = 0;
        const cart = getCart(cartId);
        if (cart) {
            cart.items.forEach((item) => {
                const product = productService.getProduct(item.productId);
                if (product) {
                    total += product.price * item.quantity;
                }
            });
        }
        return total;
    }

    return {
        createCart,
        getCart,
        addToCart,
        removeFromCart,
        getCartTotalPrice,
    };
})();

// Order Processing Module
const orderService = (() => {
    const orders = [];

    function createOrder(userId, cartId) {
        const cart = cartService.getCart(cartId);
        if (cart) {
            const order = { id: uuid(), userId, cartId, totalPrice: cartService.getCartTotalPrice(cartId), createdAt: moment().toISOString() };
            orders.push(order);
            return order;
        }
        return null;
    }

    function getOrder(orderId) {
        return orders.find((order) => order.id === orderId);
    }

    function getUserOrders(userId) {
        return orders.filter((order) => order.userId === userId);
    }

    function getAllOrders() {
        return orders;
    }

    return {
        createOrder,
        getOrder,
        getUserOrders,
        getAllOrders,
    };
})();

// Example usage
productService.addProduct('Apple', 1.99, 10);
productService.addProduct('Banana', 0.99, 15);
productService.addProduct('Orange', 1.49, 5);

authService.registerUser('john.doe', 'password123');

const user = authService.authenticateUser('john.doe', 'password123');
if (user) {
    const cart = cartService.createCart(user.id);

    cartService.addToCart(cart.id, productService.getAllProducts()[0].id);
    cartService.addToCart(cart.id, productService.getAllProducts()[1].id, 2);

    const order = orderService.createOrder(user.id, cart.id);
    console.log('Created Order:', order);
} else {
    console.log('Invalid Credentials');
}

// Output:
// Created Order: { id: '...', userId: '...', cartId: '...', totalPrice: 4.97, createdAt: '...' }
