const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, _id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = new mongodb.ObjectId(_id);
  }

  save() {
    const db = getDb();
    let dbOperation;
    if (this._id) {
      dbOperation = db.collection('products').updateOne({ _id: this._id }, { $set: this })
    }
    else {
      dbOperation = db.collection('products').insertOne(this)
    }
    return dbOperation
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      })
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      })
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      })
  }

  static deleteById(prodId) {
    const db = getDb();
    return db.collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      })
  }
}

module.exports = Product;
