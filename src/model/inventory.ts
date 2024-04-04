import {Item} from "./item";

class Inventory {
  selectedItem?: Item
  items: Array<Item> = []

  toString() {
    return `Inventory{items: ${this.items}}`
  }

}

export default Inventory;