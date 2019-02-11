// global datastore
let store = { neighborhoods: [], meals: [], customers: [], deliveries: [] };

let neighborhoodId = 0;
let customerId = 0;
let mealId = 0;
let deliveryId = 0;

class Neighborhood {
  constructor(name) {
    this.name = name;
    this.id = ++neighborhoodId;

    store.neighborhoods.push(this)
  }
  //has many deliveries

  deliveries() {
    return store.deliveries.filter(delivery => {
      return delivery.neighborhoodId === this.id
    })
  }
  //has many customers, through deliveries
  customers() {
    return store.customers.filter(customer => {
      return customer.neighborhoodId === this.id
    })
  }
  //has many meals, through deliveries
  meals() {
    const meals = this.deliveries().map(delivery =>
      delivery.meal())
    return [...new Set(meals)]
  }
}


class Customer {
  constructor(name, neighborhoodId) {
    this.name = name;
    this.id = ++customerId;
    this.neighborhoodId = neighborhoodId;

    store.customers.push(this)
  }
  //belongs to a neighborhood
  deliveries() {
    return store.deliveries.filter(delivery => {
      return delivery.customerId === this.id
    })
  }
  //has many deliveries
  meals() {
    return this.deliveries().map(delivery => {
      return delivery.meal();
    })
  }
  //has many meals, through deliveries
  totalSpent() {
    return this.meals().reduce((total, meal) => total + meal.price, 0)
  }
}

//has many customers
class Meal {
  constructor(title, price){
    this.title = title;
    this.price = price;
    this.id = ++mealId;

    store.meals.push(this)
  }

  deliveries() {
    return store.deliveries.filter(delivery => {
      return delivery.mealId === this.id;
    })
  }

  customers() {
    return this.deliveries().map(delivery => {
      return delivery.customer();
    })
  }

  static byPrice() {
    return store.meals.sort(function (a, b) {
      return b.price - a.price;
    })
  }
}

//JOIN TABLE
class Delivery {
  constructor(mealId, neighborhoodId, customerId) {
    this.mealId = mealId;
    this.neighborhoodId = neighborhoodId;
    this.customerId = customerId;
    this.id = ++deliveryId;

    store.deliveries.push(this)
  }
  //belongs to meal
  meal() {
    return store.meals.find(meal => {
      return meal.id === this.mealId;
    })
  }
  //belongs to customer
  customer() {
    return store.customers.find(customer => {
      return customer.id === this.customerId;
    })
  }
  //belongs to neighborhood
  neighborhood() {
    return store.neighborhoods.find(neighborhood => {
      return neighborhood.id === this.neighborhoodId;
    })
  }
}
