declare class ConnectionCosts {
    forward_dimension: number;
    backward_dimension: number;
    buffer: Int16Array;
    /**
     * Connection costs matrix from cc.dat file.
     * 2 dimension matrix [forward_id][backward_id] -> cost
     * @constructor
     * @param {number} forward_dimension
     * @param {number} backward_dimension
     */
    constructor(forward_dimension: number, backward_dimension: number);
    put(forward_id: number, backward_id: number, cost: number): void;
    get(forward_id: number, backward_id: number): number;
    loadConnectionCosts(connection_costs_buffer: Int16Array): void;
}
export default ConnectionCosts;
