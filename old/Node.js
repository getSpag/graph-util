// tag::constructor[]
/**
 * Graph node/vertex that hold adjacencies nodes
 */
 class Node {
    constructor(value, x, y) {
      this.value = value;
      this.adjacents = new Set(); // adjacency list
      this.x = x;
      this.y = y;
    }
    // end::constructor[]
  
    /**
     * Add node to adjacency list
     * Runtime: O(1)
     * @param {Node} node
     */
    addAdjacent(node) {
        this.adjacents.add(node);
    }
  
    /**
     * Remove node from adjacency list
     * Runtime: O(1)
     * @param {Node} node
     * @returns true if node was deleted, and false if node was not adjacent
     */
    removeAdjacent(node) {
        return this.adjacents.delete(node);
    }
  
    /**
     * Check if a Node is adjacent to other
     * Runtime: O(1)
     * @param {Node} node
     */
    isAdjacent(node) {
        return this.adjacents.has(node);
    }
  
    /**
     * Get all adjacent nodes
     * @returns HashSet of all adjacent nodes
     */
    getAdjacents() {
      return this.adjacents;
    }
  }
  
  module.exports = Node;