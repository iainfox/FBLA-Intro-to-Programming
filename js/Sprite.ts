export default class Sprite {
    sprite: HTMLImageElement
    touching_mouse: boolean
    on_click: Function
    direction: number
    position: {'x': number, 'y': number}

    constructor(img: HTMLImageElement) {
        this.sprite = img

        const rect = this.sprite.getBoundingClientRect()

        const width = this.sprite.offsetWidth
        const height = this.sprite.offsetHeight
        this.sprite.style.position = "absolute"
        this.sprite.style.transform = "translate(-50%, -50%)"

        const x = rect.left + width / 2
        const y = rect.top + height / 2

        this.position = {'x': x, 'y': y}

        this.sprite.style.left = `${x}px`
        this.sprite.style.top = `${y}px`

        this.direction = 90

        this.sprite.addEventListener('mouseenter', () => {
            this.touching_mouse = true
        })
        this.sprite.addEventListener('mouseleave', () => {
            this.touching_mouse = false
        })
        this.sprite.addEventListener('mouseclick', () => {
            if (this.on_click) {
                this.on_click();
            }
        })
    }

    /**
     * Sets the callback function to be called when the sprite is clicked.
     * 
     * @param {Function} v
     * The function to call on click
     */
    public set set_on_click(v : Function) {
        this.on_click = v
    }
    
    /**
     * Checks if the mouse pointer is currently over the sprite.
     * 
     * @returns {boolean} True if the mouse pointer is touching the sprite, false otherwise.
     */
    public get isTouchingMousePointer() : boolean {
        return this.touching_mouse
    }

    /**
     * Updates the rotation of the sprite element according to its direction.
     * Should be called whenever the direction property changes.
     * 
     * @private
     */
    private update_rotation() {
        this.sprite.style.rotate = `${this.direction}`
    }

    /**
     * Rotates the sprite clockwise by the given number of degrees.
     * 
     * @param {number} degrees
     * The number of degrees to rotate clockwise.
     */
    public set turn_x_degrees_clockwise(degrees: number) {
        this.direction += degrees
        this.update_rotation()
    }

    /**
     * Rotates the sprite counterclockwise by the given number of degrees.
     * 
     * @param {number} degrees
     * The number of degrees to rotate counterclockwise.
     */
    public set turn_x_degrees_counter_clockwise(degrees: number) {
        this.direction -= degrees
        this.update_rotation()
    }

    /**
     * Points the sprite in the specified direction.
     * 
     * @param {number} degrees
     * The direction in degrees to point the sprite.
     */
    public set point_in_direction(degrees: number) {
        this.direction = degrees
        this.update_rotation()
    }

    /**
     * Moves the sprite x amount of steps (10px) in the direction the sprite is facing
     * 
     * @param {number} steps
     * the number of steps to take
     */
    public move_x_steps(steps: number) {
        const x = Math.cos(-this.direction)* (steps*10)
        const y = Math.sin(-this.direction)* (steps*10)
        this.position = {'x': x, 'y': y}
        this.sprite.style.left = `${x}`
        this.sprite.style.top = `${y}`
    }

    /**
     * Sets the x and y position on the screen to the provided values
     * 
     * @param {number} x
     * the x position on the screen to move the sprite to
     * @param {number} y
     * the y position on the screen to move the sprite to
     */
    public go_to_xy(x: number, y: number) {
        this.position = {'x': x, 'y': y}
        this.sprite.style.left = `${x}`
        this.sprite.style.top = `${y}`
    }

    /**
     * Changes the x position by the provided amount
     * 
     * @param {number} x
     * the amount to change the x position by
     */
    public change_x_by(x: number) {
        const new_x = this.position.x += x
        this.position.x = new_x
        this.sprite.style.left = `${new_x}`
    }

    /**
     * Changes the y position by the provided amount
     * 
     * @param {number} y
     * the amount to change the y position by
     */
    public change_y_by(y: number) {
        const new_y = this.position.y += y
        this.position.y = new_y
        this.sprite.style.left = `${new_y}`
    }

    /**
     * point_in_direction_xy
     * 
     * @param {number} x2
     * the x position to point the sprite at
     * @param {number} y2
     * the y position to point the sprite at
     */
    public point_in_direction_xy(x2: number, y2: number) {
        const new_direction_radians = Math.atan2(y2-this.position.y, x2-this.position.x)
        const new_direction_degrees = new_direction_radians * (180/Math.PI)
        this.direction = new_direction_degrees
        this.update_rotation()
    }
}