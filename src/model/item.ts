class Item {
  name!: string;
  base64Image!: string

  toString() {
    return `Item{name: ${this.name}, base64Image: ${this.base64Image}}`
  }
}

export default Item;