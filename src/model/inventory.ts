import Item from "./item";

class Inventory {
  items: Array<Item> = []

  toString() {
    return `Inventory{items: ${this.items}}`
  }

}

export default Inventory;