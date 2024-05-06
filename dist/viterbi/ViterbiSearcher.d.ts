import ConnectionCosts from "../dict/ConnectionCosts.js";
import ViterbiLattice from "./ViterbiLattice.js";
import ViterbiNode from "./ViterbiNode.js";
declare class ViterbiSearcher {
    connection_costs: ConnectionCosts;
    /**
     * ViterbiSearcher is for searching best Viterbi path
     * @param {ConnectionCosts} connection_costs Connection costs matrix
     * @constructor
     */
    constructor(connection_costs: ConnectionCosts);
    /**
     * Search best path by forward-backward algorithm
     * @param {ViterbiLattice} lattice Viterbi lattice to search
     * @returns {Array} Shortest path
     */
    search(lattice: ViterbiLattice): ViterbiNode[];
    forward(lattice: ViterbiLattice): ViterbiLattice;
    backward(lattice: ViterbiLattice): ViterbiNode[];
}
export default ViterbiSearcher;
