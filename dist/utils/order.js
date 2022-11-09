"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrders = void 0;
const nanoid_1 = require("nanoid");
const shop_1 = __importDefault(require("../models/shop"));
const order_1 = __importDefault(require("../models/order"));
function calculateProductsAmount(cartProducts) {
    const orderProducts = [];
    for (let prod of cartProducts) {
        const amount = prod.price * prod.quantity;
        const stringShopId = prod.shopId;
        const orderProduct = {
            name: prod.name,
            id: prod.productId,
            price: prod.price,
            quantity: prod.quantity,
            shopId: stringShopId,
            amount,
        };
        orderProducts.push(orderProduct);
    }
    return orderProducts;
}
async function groupShopsOrder(products) {
    let shopsOrder = {};
    let shopId = products[0].shopId;
    let shop = await shop_1.default.findById(shopId).select("name -_id");
    shopsOrder[shopId] = {
        products: [],
        shop: { id: shopId, name: shop.name },
        shortId: (0, nanoid_1.customAlphabet)("1234567890ABCDEF", 10)(),
    };
    for (let i = 0; i < products.length; i++) {
        const prod = products[i];
        if (prod.shopId === shopId) {
            shopsOrder[shopId].products.push(prod);
        }
        else {
            shopId = prod.shopId;
            if (shopsOrder[shopId]) {
                shopsOrder[shopId].products.push(prod);
            }
            else {
                let shop = await shop_1.default.findById(shopId).select("name -_id");
                shopsOrder[shopId] = {
                    products: [prod],
                    shop: { id: shopId, name: shop.name },
                    shortId: (0, nanoid_1.customAlphabet)("1234567890ABCDEF", 10)(),
                };
            }
        }
    }
    return shopsOrder;
}
function calculateTotalAmount(shopsOrder) {
    const copiedShopsOrder = { ...shopsOrder };
    const modifiedShopsOrder = {};
    for (let key in copiedShopsOrder) {
        const products = [...copiedShopsOrder[key].products];
        let totalAmount = 0;
        for (let prod of products) {
            totalAmount += prod.amount;
        }
        modifiedShopsOrder[key] = { ...copiedShopsOrder[key], totalAmount };
    }
    return { ...modifiedShopsOrder };
}
async function saveOrders(shopsOrder, user, delivery, note) {
    for (let key in shopsOrder) {
        const { shortId, shop, products, totalAmount } = shopsOrder[key];
        await new order_1.default({
            shortId,
            shop,
            user,
            products,
            totalAmount,
            status: "Processing",
            note,
            delivery,
        }).save();
    }
    return shopsOrder;
}
async function sendOrders(data) {
    const products = calculateProductsAmount(data.cartProducts);
    const groupedShopsOrder = await groupShopsOrder(products);
    const modifiedShopsOrder = calculateTotalAmount(groupedShopsOrder);
    const shopsOrder = await saveOrders(modifiedShopsOrder, data.user, data.delivery, data.note);
    return shopsOrder;
}
exports.sendOrders = sendOrders;
