const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    })
    let newQty = 1;
    let updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQty = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQty;
    }
    else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQty
      })
    }
    const updatedCart = {
      items: updatedCartItems
    };
    // const updatedCart = { items: [{ productId: product._id, quantity: 1 }] };
    const db = getDb();
    return db.collection('users').updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    )
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(item => {
      return item.productId;
    })
    return db.collection('products').find({
      _id: {
        $in: productIds
      }
    })
      .toArray()
      .then(products => {
        console.log(products);
        return products.map(product => {
          return {
            ...product, quantity: this.cart.items.find(item => {
              return item.productId.toString() === product._id.toString();
            }).quantity
          }
        })
      })
  }

  deleteFromCart(prodId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== prodId.toString();
    })
    return db.collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } })
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      })
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      })
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      })
  }
}

module.exports = User;
