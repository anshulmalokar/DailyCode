"use strict";
// This will ensure that any property that's been added to the cache will be having a property
// of id
class DataCache {
    constructor(name) {
        this.cache = [];
        this.name = '';
        this.name = name;
        console.log('Cache with the name initilized ' + name);
    }
    addItems(items) {
        this.cache.push(...items);
        console.log("Added items " + items.length + " " + " to" + this.name + " cache");
    }
    getAll() {
        return this.cache;
    }
    getProperty(property, value) {
        return this.cache.filter(e => e[property] === value);
    }
}
const productCache = new DataCache("products");
const products = [
    { id: 101, name: "Laptop X", price: 1200, inStock: true },
    { id: 102, name: "Mouse Pro", price: 50, inStock: false },
    { id: 103, name: "Monitor 4K", price: 450, inStock: true },
];
productCache.addItems(products);
const availableProducts = productCache.getProperty("inStock", true);
console.log("Found available products:", availableProducts);
