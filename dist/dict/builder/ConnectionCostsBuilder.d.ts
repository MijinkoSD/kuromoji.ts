import ConnectionCosts from "../ConnectionCosts.js";
declare class ConnectionCostsBuilder {
    lines: number;
    connection_cost: ConnectionCosts | null;
    /**
     * Builder class for constructing ConnectionCosts object
     * @constructor
     */
    constructor();
    putLine(line: string): void;
    build(): ConnectionCosts | null;
}
export default ConnectionCostsBuilder;
