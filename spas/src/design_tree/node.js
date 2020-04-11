export class NodeSource {
  constructor() {
    /**@type string */
    this.name
    /**@type string */
    this.value
    /**@type string */
    this.valueType
    /**@type string */
    this.question
    /**@type {[string]:NodeSource} */
    this.options
    /**@type string */
    this.id
    /**@type {[]:any} */
    this.results
  }
}

export class Tree {
  constructor() {
    /**@type NodeSource */
    this.root
  }
}

export class Node {
  constructor() {
    /**@type NodeSource*/
    this.source
    /**@type Node[]*/
    this.selecteds
    /**@type string */
    this.name
    /**@type string */
    this.value
    /**@type string */
    this.valueType
    /**@type {[]:any} */
    this.results
    /**@type string */
    this.question
    /**@type Node[] */
    this.options
  }
}
