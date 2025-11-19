export default class Sprite {
    sprite: HTMLImageElement
    touching_mouse: boolean | null = null
    on_click: Function | null = null
    direction: number
    position: {'x': number, 'y': number}
    broadcasts: { [broadcastName: string]: Function[] } | null = null

    constructor(img: HTMLImageElement) {
        this.sprite = img

        const rect = this.sprite.getBoundingClientRect()

        const width = this.sprite.offsetWidth
        const height = this.sprite.offsetHeight
        this.sprite.style.position = "absolute"
        this.sprite.style.transform = "translate(-50%, -50%)"

        const cssX = rect.left + width / 2
        const cssY = rect.top + height / 2

        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const userX = cssX - centerX
        const userY = centerY - cssY

        this.position = {'x': userX, 'y': userY}

        this.sprite.style.left = `${cssX}px`
        this.sprite.style.top = `${cssY}px`

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
     * Converts user coordinates (center-origin, Y-down) to CSS coordinates (top-left origin).
     * 
     * @param {number} userX - The x coordinate in user (center-origin) space.
     * @param {number} userY - The y coordinate in user (center-origin) space.
     * @returns {{cssX: number, cssY: number}} The equivalent CSS coordinates (top-left origin).
     * @private
     */
    private userToCss(userX: number, userY: number): {cssX: number, cssY: number} {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const cssX = centerX + userX
        const cssY = centerY - userY
        return {cssX, cssY}
    }

    /**
     * Updates the CSS position of the sprite based on the current user coordinates.
     * 
     * @private
     */
    private updateCssPosition() {
        const {cssX, cssY} = this.userToCss(this.position.x, this.position.y)
        this.sprite.style.left = `${cssX}px`
        this.sprite.style.top = `${cssY}px`
    }

    /**
     * Calls the callback function associated with a broadcast message if it exists.
     * 
     * @param {string} broadcast_name
     * The name of the broadcast message to respond to.
     */
    public recieve_broadcast(broadcast_name: string) {
        if (!this.broadcasts) return
        
        if (this.broadcasts?.[broadcast_name]) {
            this.broadcasts[broadcast_name]?.forEach(funct => {
                funct();
            });
        }
    }

    /**
     * Adds a callback function for the specified broadcast.
     * 
     * @param {string} broadcast_name - The name of the broadcast message.
     * @param {Function} broadcast_callback - The callback function to invoke when the broadcast is received.
     */
    public add_broadcast(broadcast_name: string, broadcast_callback: Function) {
        if (!this.broadcasts) return

        if (!this.broadcasts[broadcast_name]) {
            this.broadcasts[broadcast_name] = [];
        }
        this.broadcasts[broadcast_name].push(broadcast_callback);
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
        return this.touching_mouse ?? false;
    }

    /**
     * Updates the rotation of the sprite element according to its direction.
     * Should be called whenever the direction property changes.
     * 
     * @private
     */
    private update_rotation() {
        this.sprite.style.rotate = `${this.direction - 90}deg`
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
     * Moves the sprite x amount of steps in the direction the sprite is facing
     * 
     * @param {number} steps
     * the number of steps to take
     */
    public move_x_steps(steps: number) {
        const directionRadians = (this.direction - 90) * (Math.PI / 180);
        const x = Math.cos(directionRadians) * steps;
        const y = -Math.sin(directionRadians) * steps;
        this.position.x += x;
        this.position.y += y;
        this.updateCssPosition();
    }

    /**
     * Sets the x and y position on the screen to the provided values
     * 
     * @param {number} x
     * the x position on the screen to move the sprite to (0,0 is center)
     * @param {number} y
     * the y position on the screen to move the sprite to (0,0 is center, positive Y is down)
     */
    public go_to_xy(x: number, y: number) {
        this.position = {'x': x, 'y': y}
        this.updateCssPosition()
    }

    /**
     * Changes the x position by the provided amount
     * 
     * @param {number} x
     * the amount to change the x position by
     */
    public change_x_by(x: number) {
        this.position.x += x
        this.updateCssPosition()
    }

    /**
     * Changes the y position by the provided amount
     * 
     * @param {number} y
     * the amount to change the y position by (positive values move down)
     */
    public change_y_by(y: number) {
        this.position.y += y
        this.updateCssPosition()
    }

    /**
     * Sets the x position to the provided x coordinate
     * 
     * @param {number} x
     * the x coordinate to set the x to (0 is center)
     */
    public set_x_to(x: number) {
        this.position.x = x
        this.updateCssPosition()
    }

    /**
     * Sets the y position to the provided y coordinate
     * 
     * @param {number} y
     * the y coordinate to set the y to (0 is center, positive Y is down)
     */
    public set_y_to(y: number) {
        this.position.y = y
        this.updateCssPosition()
    }

    /**
     * point_in_direction_xy
     * 
     * @param {number} x2
     * the x position to point the sprite at (in user coordinates, 0 is center)
     * @param {number} y2
     * the y position to point the sprite at (in user coordinates, 0 is center, positive Y is down)
     */
    public point_in_direction_xy(x2: number, y2: number) {
        const new_direction_radians = Math.atan2(-(y2-this.position.y), x2-this.position.x)
        const new_direction_degrees = new_direction_radians * (180/Math.PI)
        this.direction = new_direction_degrees
        this.update_rotation()
    }
}