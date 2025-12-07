export default class Sprite {
    private touching_mouse: boolean = false
    private on_click_callbacks: Function[] = []
    private start_as_clone_callbacks: Function[] = []
    private forever_callbacks: Function[] = []
    private direction: number = 90
    private position: {'x': number, 'y': number} = {'x': 0, 'y': 0}
    private broadcasts: { [broadcastName: string]: Function[] } = {}
    private costumes: { [costumeName: string]: HTMLImageElement} = {}
    private current_costume: string = ""
    private scale: number = 100
    private color: number = 0
    private ghost: number = 0
    private brightness: number = 100
    private hidden: boolean = false
    private is_clone: boolean = false
    private mouse_position: {'x': number, 'y': number} = {'x': 0, 'y': 0}

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
    
    public get onClickCallbacks(): Function[] {
        return this.on_click_callbacks
    }
    
    public get foreverCallbacks(): Function[] {
        return this.forever_callbacks
    }

    /**
     * Creates a new sprite. This constructor supports two cases:
     * 1. Creating a new sprite from a costume.
     * 2. Creating a blank clone of an existing sprite.
     *
     * @param {boolean|string|HTMLImageElement} param1 - 
     * If creating a clone, pass `true`.
     * If loading a costume, pass the URL string or HTMLImageElement instance.
     * 
     * @param {string} [param2] - 
     * Required if `param1` is a costume source (the name to assign to the costume).
     * Should be omitted if `param1` is `true`.
     */
    constructor(is_clone: boolean)
    constructor(default_costume: string | HTMLImageElement, costume_name: string) 
    constructor(
        param1: boolean | string | HTMLImageElement,
        param2?: string
    ) {
        if (typeof param1 == 'boolean' && param1 === true && param2 === undefined) {
            this.is_clone = true
            return
        }

        const default_costume = param1 as string | HTMLImageElement;
        const costume_name = param2 as string;

        if (default_costume instanceof HTMLImageElement) {
            this.costumes[costume_name] = default_costume
        } else {
            this.add_costume(costume_name, default_costume).catch(err => {
                console.error(`Failed to load initial costume "${costume_name}":`, err)
            })
        }
        this.switch_costume(costume_name)

        window.addEventListener("mousemove", (e) => {
            this.mouse_position = {'x': e.clientX-window.innerWidth/2, 'y': e.clientY-window.innerHeight/2}
        })
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
                funct(this)
            });
        }
    }

    /**
     * Adds a callback function for the specified broadcast.
     * 
     * @param {string} broadcast_name - The name of the broadcast message.
     * @param {Function} broadcast_callback - The callback function to invoke when the broadcast is received.
     * The callback should accept the sprite instance as a parameter: (sprite) => { ... }
     */
    public add_broadcast(broadcast_name: string, broadcast_callback: Function) {
        if (!this.broadcasts) return

        if (!this.broadcasts[broadcast_name]) {
            this.broadcasts[broadcast_name] = []
        }
        this.broadcasts[broadcast_name].push(broadcast_callback)
    }

    /**
     * Adds a callback function to be called when the sprite is clicked.
     * The callback function will receive the sprite instance as its first parameter.
     * 
     * @param {Function} callback
     * The function to call on click. Should accept the sprite instance as a parameter: (sprite) => { ... }
     */
    public add_on_click(callback: Function) {
        this.on_click_callbacks.push(callback)
    }

    /**
     * Adds a callback function that will be called on every frame/tick (forever).
     * The callback function will receive the sprite instance as its first parameter.
     * 
     * @param {Function} callback
     * The function to be called on every frame. Should accept the sprite instance as a parameter: (sprite) => { ... }
     */
    public add_forever_callback(callback: Function) {
        this.forever_callbacks.push(callback)
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
     * Adds a costume to the sprite by loading an image from a URL.
     * 
     * @param {string} costume_name
     * the name of the costume
     * @param {string} image_url
     * the URL or path to the costume image
     * @returns {Promise<HTMLImageElement>}
     * A promise that resolves when the image is loaded, or rejects if loading fails.
     */
    public add_costume(costume_name: string, image_url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image()
            
            img.onload = () => {
                this.costumes[costume_name] = img
                resolve(img)
            }
            
            img.onerror = () => {
                reject(new Error(`Failed to load image from URL: ${image_url}`))
            }
            
            img.src = image_url
        })
    }

    /**
     * Switches the current sprite's costume to the given costume name if it exists.
     * 
     * @param {string} costume_name
     * The name of the costume to switch to.
     * @returns {boolean}
     * True if the costume was switched successfully, false if the costume doesn't exist.
     */
    public switch_costume(costume_name: string): boolean {
        if (this.costumes[costume_name]) {
            this.current_costume = costume_name
            return true
        }
        return false
    }

    /**
     * Gets the current costume's image element.
     * 
     * @returns {HTMLImageElement | undefined}
     * The image element for the current costume, or undefined if no costume is set.
     */
    public get_current_costume_image(): HTMLImageElement | undefined {
        if (this.current_costume && this.costumes[this.current_costume]) {
            return this.costumes[this.current_costume]
        }
        return undefined
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
     * Creates a new clone of this sprite.
     * 
     * The cloned sprite will:
     * - Be flagged as a clone.
     * - Inherit the same position, direction, costume, scale, and effect values (color, ghost, brightness).
     * - Make its own copies of the costumes, current costume, on-click callbacks, and broadcasts (not shared).
     * - Callbacks will receive the clone instance when called (not the original).
     * - Have the same hidden/shown state.
     * 
     * @returns {Sprite}
     * The cloned Sprite instance.
     */
    public create_clone(): Sprite {
        const clone = new Sprite(true)
        
        clone.touching_mouse = this.touching_mouse
        clone.on_click_callbacks = [...this.on_click_callbacks]
        clone.direction = this.direction
        clone.position = { x: this.position.x, y: this.position.y }
        clone.broadcasts = {}
        for (const broadcastName in this.broadcasts) {
            const callbacks = this.broadcasts[broadcastName]
            if (callbacks) {
                clone.broadcasts[broadcastName] = [...callbacks]
            }
        }
        clone.costumes = { ...this.costumes }
        clone.current_costume = this.current_costume
        clone.scale = this.scale
        clone.color = this.color
        clone.ghost = this.ghost
        clone.brightness = this.brightness
        clone.hidden = this.hidden
        clone.start_as_clone_callbacks = [...this.start_as_clone_callbacks]

        return clone
    }

    /**
     * Adds a callback function that will be called when the sprite starts as a clone.
     * The callback function will receive the sprite instance as its first parameter.
     * 
     * @param {Function} callback
     * The function to be called when the sprite starts as a clone.
     * Should accept the sprite instance as a parameter: (sprite) => { ... }
     */
    public add_start_as_clone_callback(callback: Function) {
        this.start_as_clone_callbacks.push(callback)
    }
}