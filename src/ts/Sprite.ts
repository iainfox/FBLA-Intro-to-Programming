export default class Sprite {
    private sprite: HTMLImageElement
    private touching_mouse: boolean = false
    private on_click: Function | null = null
    private direction: number = 90
    private position: {'x': number, 'y': number} = {'x': 0, 'y': 0}
    private broadcasts: { [broadcastName: string]: Function[] } = {}
    private costumes: { [costumeName: string]: string} = {}
    private current_costume: string = ""
    private scale: number = 100
    private color: number = 0
    private ghost: number = 0
    private brightness: number = 100
    private hidden: boolean = false
    private is_clone: boolean

    public get Direction(): number {
        return this.direction
    }

    public get Position(): {'x': number, 'y': number} {
        return this.position
    }

    public get CurrentCostume(): string {
        return this.current_costume
    }

    public get Scale(): number {
        return this.scale
    }

    public get Color(): number {
        return this.color
    }

    public get Ghost(): number {
        return this.ghost
    }

    public get Brightness(): number {
        return this.brightness
    }

    public get isHidden(): boolean {
        return this.hidden
    }

    public get isClone(): boolean {
        return this.is_clone
    }

    /**
     * Creates a new sprite with an initial costume.
     * 
     * @param {string} costume_name
     * The name to assign to the costume.
     * @param {string} image_url
     * The URL or path to the costume image.
     */
    constructor(default_costume: string, costume_name: string, is_clone: boolean = false) {
        this.add_costume(costume_name, default_costume)
        this.switch_costume(costume_name)
        this.is_clone = is_clone
    }

    /**
     * Converts user coordinates (center-origin, Y-down) to CSS coordinates (top-left origin).
     * 
     * @param {number} userX - The x coordinate in user (center-origin) space.
     * @param {number} userY - The y coordinate in user (center-origin) space.
     * @returns {{cssX: number, cssY: number}} The equivalent CSS coordinates (top-left origin).
     * 
     */
    public userToCss(userX: number, userY: number): {cssX: number, cssY: number} {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const cssX = centerX + userX
        const cssY = centerY - userY
        return {cssX, cssY}
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
                funct()
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
            this.broadcasts[broadcast_name] = []
        }
        this.broadcasts[broadcast_name].push(broadcast_callback)
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
        return this.touching_mouse ?? false
    }

    /**
     * Rotates the sprite clockwise by the given number of degrees.
     * 
     * @param {number} degrees
     * The number of degrees to rotate clockwise.
     */
    public set turn_x_degrees_clockwise(degrees: number) {
        this.direction += degrees
    }

    /**
     * Rotates the sprite counterclockwise by the given number of degrees.
     * 
     * @param {number} degrees
     * The number of degrees to rotate counterclockwise.
     */
    public set turn_x_degrees_counter_clockwise(degrees: number) {
        this.direction -= degrees
    }

    /**
     * Points the sprite in the specified direction.
     * 
     * @param {number} degrees
     * The direction in degrees to point the sprite.
     */
    public set point_in_direction(degrees: number) {
        this.direction = degrees
    }

    /**
     * Moves the sprite x amount of steps in the direction the sprite is facing
     * 
     * @param {number} steps
     * the number of steps to take
     */
    public move_x_steps(steps: number) {
        const directionRadians = (this.direction - 90) * (Math.PI / 180)
        const x = Math.cos(directionRadians) * steps
        const y = -Math.sin(directionRadians) * steps
        this.position.x += x
        this.position.y += y
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
    }

    /**
     * Changes the x position by the provided amount
     * 
     * @param {number} x
     * the amount to change the x position by
     */
    public change_x_by(x: number) {
        this.position.x += x
    }

    /**
     * Changes the y position by the provided amount
     * 
     * @param {number} y
     * the amount to change the y position by (positive values move down)
     */
    public change_y_by(y: number) {
        this.position.y += y
    }

    /**
     * Sets the x position to the provided x coordinate
     * 
     * @param {number} x
     * the x coordinate to set the x to (0 is center)
     */
    public set_x_to(x: number) {
        this.position.x = x
    }

    /**
     * Sets the y position to the provided y coordinate
     * 
     * @param {number} y
     * the y coordinate to set the y to (0 is center, positive Y is down)
     */
    public set_y_to(y: number) {
        this.position.y = y
    }

    /**
     * Points the sprite at a specific coordinate set
     * 
     * @param {number} x2
     * the x position to point the sprite at (in user coordinates, 0 is center)
     * @param {number} y2
     * the y position to point the sprite at (in user coordinates, 0 is center, positive Y is down)
     */
    public point_in_direction_xy(x2: number, y2: number) {
        const new_direction_radians = Math.atan2(-(y2-this.position.y), x2-this.position.x)
        const new_direction_degrees = new_direction_radians * (180/Math.PI)
        this.direction = new_direction_degrees + 90
    }

    /**
     * Adds a costume to the sprite.
     * 
     * @param {string} costume_name
     * the name of the costume
     * @param {string} image_url
     * the URL of the costume image
     */
    public add_costume(costume_name: string, image_url: string) {
        this.costumes[costume_name] = image_url
    }

    /**
     * Switches the current sprite's costume to the given costume name if it exists.
     * 
     * @param {string} costume_name
     * The name of the costume to switch to.
     */
    public switch_costume(costume_name: string) {
        if (this.costumes[costume_name]) {
            this.current_costume = costume_name
        }
    }

    /**
     * Changes the size of the sprite by the given x amount.
     * 
     * @param {number} x
     * The amount to change the sprite's size by.
     */
    public change_size_by_x(x: number) {
        this.scale += x
        this.scale = Math.min(Math.max(this.scale, 0), 500)
    }

    /**
     * Set the size of the sprite to the given x amount.
     * 
     * @param {number} x
     * The number to change the sprite's size to.
     */
    public set_size_to_x(x: number) {
        this.scale = Math.min(Math.max(x, 0), 500)
    }

    /**
     * Changes the specified effect by a given amount.
     * 
     * @param {string} effect_name - The name of the effect ("color", "ghost", or "brightness").
     * @param {number} x - The amount to change the effect by.
     */
    public change_a_effect_by_x(effect_name: string, x: number) {
        switch (effect_name) {
            case "color":
                this.color += x
                this.color = this.color%360
                break
            
            case "ghost":
                this.ghost -= x
                this.ghost = Math.min(Math.max(this.ghost, 0), 100)
                break
            
            case "brightness":
                this.brightness += x
                this.brightness = Math.min(Math.max(this.brightness, -100), 100)
                break
            default:
                break
        }
    }

    /**
     * Changes the specified effect by a given amount.
     * 
     * @param {string} effect_name - The name of the effect ("color", "ghost", or "brightness").
     * @param {number} x - The amount to change the effect by.
     */
    public set_a_effect_to_x(effect_name: string, x: number) {
        switch (effect_name) {
            case "color":
                this.color = x
                this.color = this.color%360
                break
            
            case "ghost":
                this.ghost = Math.min(Math.max(x, 0), 100)
                break
            
            case "brightness":
                this.brightness = Math.min(Math.max(x, -100), 100)
                break
        
            default:
                break
        }
    }

    /**
     * Shows the sprite
     */
    public show() {
        this.hidden = false
    }

    /**
     * Hides the sprite
     */
    public hide() {
        this.hidden = true
    }

    /**
     * Creates a clone of this sprite.
     * 
     * The cloned sprite will appear at the same position,
     * have the same direction, effects, and costume, but will be flagged as a clone.
     * The DOM element is also cloned, and the clone is appended to the DOM.
     * 
     * @returns {Sprite} 
     * The cloned Sprite instance.
     */
    public create_clone(): Sprite {
        const spriteCloneElem = this.sprite.cloneNode(true) as HTMLElement

        const clone = Object.create(Object.getPrototypeOf(this))
        Object.assign(clone, this)

        clone.is_clone = true
        clone.sprite = spriteCloneElem

        if (this.sprite.parentElement) {
            this.sprite.parentElement.appendChild(spriteCloneElem)
        } else {
            document.body.appendChild(spriteCloneElem)
        }

        clone.update_look()
        clone.updateCssPosition?.()

        return clone
    }
}