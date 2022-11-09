import { customAlphabet } from "nanoid";

import { CartProduct } from "../types/product";
import Shop from "../models/shop";
import * as orderTypes from "../types/order";
import Order from "../models/order";

function calculateProductsAmount(
  cartProducts: CartProduct[]
): orderTypes.Product[] {
  const orderProducts: orderTypes.Product[] = [];

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

async function groupShopsOrder(
  products: orderTypes.Product[]
): Promise<orderTypes.ShopsOrder> {
  let shopsOrder = {};
  let shopId = products[0].shopId;

  let shop = await Shop.findById(shopId).select("name -_id");

  shopsOrder[shopId] = {
    products: [],
    shop: { id: shopId, name: shop.name },
    shortId: customAlphabet("1234567890ABCDEF", 10)(),
  };

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];

    if (prod.shopId === shopId) {
      shopsOrder[shopId].products.push(prod);
    } else {
      shopId = prod.shopId;

      if (shopsOrder[shopId]) {
        shopsOrder[shopId].products.push(prod);
      } else {
        let shop = await Shop.findById(shopId).select("name -_id");

        shopsOrder[shopId] = {
          products: [prod],
          shop: { id: shopId, name: shop.name },
          shortId: customAlphabet("1234567890ABCDEF", 10)(),
        };
      }
    }
  }

  return shopsOrder;
}

function calculateTotalAmount(shopsOrder: {}): orderTypes.ShopsOrder {
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

async function saveOrders(
  shopsOrder: orderTypes.ShopsOrder,
  user: orderTypes.User,
  delivery: orderTypes.Delivery,
  note?: string
): Promise<orderTypes.ShopsOrder> {
  for (let key in shopsOrder) {
    const { shortId, shop, products, totalAmount } = shopsOrder[key];

    await new Order({
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

export async function sendOrders(data: {
  cartProducts: CartProduct[];
  user: orderTypes.User;
  delivery: orderTypes.Delivery;
  note?: string;
}): Promise<orderTypes.ShopsOrder> {
  const products = calculateProductsAmount(data.cartProducts);
  const groupedShopsOrder = await groupShopsOrder(products);
  const modifiedShopsOrder = calculateTotalAmount(groupedShopsOrder);
  const shopsOrder = await saveOrders(
    modifiedShopsOrder,
    data.user,
    data.delivery,
    data.note
  );
  return shopsOrder;
}
