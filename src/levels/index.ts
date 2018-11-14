export interface ILevel {
    /**
     * Total number of rows in the game board
     *
     * @type {number}
     * @memberof ILevel
     */
    readonly height: number

    /**
     * Duration between piece movements in milliseconds
     *
     * @type {number}
     * @memberof ILevel
     */
    readonly speed: number

    /**
     * Total number of columns in the game board
     *
     * @type {number}
     * @memberof ILevel
     */
    readonly width: number
}

export const Levels: { [key: string]: ILevel } = {
    [1]: {
        height: 12,
        speed: 1000,
        width: 15
    }
}
