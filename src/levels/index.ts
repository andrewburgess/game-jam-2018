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
    /**
     * Defines the shape of the structure to build.
     *
     * Starts from the lower left portion of the platform, going to the right
     * and then up to the left for the next row
     *
     * Uses a `#` to mark a cell, and a ` ` to mark an empty space
     *
     * @type {string}
     * @memberof IPlatform
     */
    cells: string

    /**
     * Number of blocks wide the platform is
     *
     * @type {number}
     * @memberof IPlatform
     */
    width: number

    /**
     * X coordinate for the platform
     *
     * @type {number}
     * @memberof IPlatform
     */
    x: number

    /**
     * Y coordinate for the platform
     *
     * @type {number}
     * @memberof IPlatform
     */
    y: number
}

export const Levels: { [key: string]: ILevel } = {
    [1]: {
        height: 17,
        platforms: [
            {
                cells: " ## ##  #",
                width: 3,
                x: 8,
                y: 9
            }
        ],
        speed: 500,
        width: 29,
        zoom: 1
    }
}
