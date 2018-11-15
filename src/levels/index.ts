export interface ILevel {
    /**
     * Total number of rows in the game board
     *
     * @type {number}
     * @memberof ILevel
     */
    readonly height: number

    /**
     * Platforms in the level where building spots are located
     *
     * @type {IPlatform[]}
     * @memberof ILevel
     */
    readonly platforms: IPlatform[]

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

    /**
     * Amount of zoom on the camera for if the levels get larger than the
     * viewport
     *
     * @type {number}
     * @memberof ILevel
     */
    readonly zoom: number
}

export interface IPlatform {
    width: number

    x: number

    y: number
}

export const Levels: { [key: string]: ILevel } = {
    [1]: {
        height: 12,
        platforms: [
            {
                width: 4,
                x: 3,
                y: 4
            },
            {
                width: 3,
                x: 8,
                y: 9
            }
        ],
        speed: 100,
        width: 15,
        zoom: 1
    }
}
