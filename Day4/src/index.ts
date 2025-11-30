interface Product{
    id: number,
    name: string,
    price: number,
    inStock: boolean
}

interface User{
    id: string,
    email: string,
    joinDate: string,
    isAdmin: boolean
}

// This will ensure that any property that's been added to the cache will be having a property of id
class DataCache<T extends {id: any}>{
    private cache: T[] = [];
    private name: string = '';

    constructor(name: string){
        this.name = name;
        console.log('Cache with the name initilized ' + name);
    }

    public addItems(items: T[]){
        this.cache.push(...items);
        console.log("Added items " + items.length + " " + " to" + this.name + " cache");
    }

    public getAll(): T[]{
        return this.cache;
    }

    public getProperty<K extends keyof T>(property: K, value: T[K]): T[]{
        return this.cache.filter(e => e[property] === value);
    }
}

const productCache = new DataCache<Product>("products");
const products: Product[] = [
  { id: 101, name: "Laptop X", price: 1200, inStock: true },
  { id: 102, name: "Mouse Pro", price: 50, inStock: false },
  { id: 103, name: "Monitor 4K", price: 450, inStock: true },
];
productCache.addItems(products);
const availableProducts = productCache.getProperty("inStock", true);
console.log("Found available products:", availableProducts);