import {Item} from "./item";

export class Inventory {
  selectedItem?: Item
  items: Array<Item> = []

  toString() {
    return `Inventory{items: ${this.items}}`
  }

}