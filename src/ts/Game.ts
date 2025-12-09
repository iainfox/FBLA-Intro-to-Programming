import Sprite from 'Sprite'

export default class Game {
    private backdrop_list: { [backdrop_name: string]: string } = {}
    private current_backdrop: string
    private sprite_list: Sprite[] = []
    private canvas: HTMLCanvasElement
    private canvas_context: CanvasRenderingContext2D
    private frame_count: number = 0

    constructor (backdrop_name: string, backdrop_image_path: string, canvas: HTMLElement | null) {
        document.body.style.backgroundRepeat = 'no-repeat'
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        this.add_backdrop(backdrop_name, backdrop_image_path)
        this.current_backdrop = backdrop_name
        this.canvas = canvas as HTMLCanvasElement ?? (() => { throw new Error("Could not get canvas") })();
        this.canvas_context = this.canvas.getContext("2d") ?? (() => { throw new Error("Could not get canvas 2d context") })();

        this.canvas.addEventListener('click', (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top

            for (const sprite of this.sprite_list) {
                if (sprite.isHidden) continue

                const sprite_image = sprite.get_current_costume_image();
                if (sprite_image) {
                    const sprite_width = sprite_image.width;
                    const sprite_height = sprite_image.height;

                    const left = sprite.Position.x - sprite_width / 2;
                    const right = sprite.Position.x + sprite_width / 2;
                    const top = sprite.Position.y - sprite_height / 2;
                    const bottom = sprite.Position.y + sprite_height / 2;

                    if (
                        mouseX >= left &&
                        mouseX <= right &&
                        mouseY >= top &&
                        mouseY <= bottom
                    ) {
                        sprite.onClickCallbacks.forEach(callback => {
                            callback(sprite)
                        });
                    }
                }
            }
        })

        const resize_canvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize_canvas);
        resize_canvas();
    }

    /**
     * Starts the main render and logic loop, invoking forever callbacks on all sprites.
     */
    public start_loop() {
        this.broadcast("Green Flag Clicked")
        const target_fps = 60;
        const frame_delay = 1000 / target_fps;
        let last_frame_time: DOMHighResTimeStamp = performance.now();

        const loop = () => {
            const now = performance.now();
            const elapsed = now - last_frame_time;

            if (elapsed >= frame_delay) {
                last_frame_time = now - (elapsed % frame_delay);

                for (const sprite of this.sprite_list) {
                    sprite.foreverCallbacks.forEach(callback => {
                        callback(sprite)
                    });
                }
                this.render();
                this.frame_count++;
            }

            requestAnimationFrame(loop);
        }
        loop();
    }

    public get currentFrameCount() : number {
        return this.frame_count
    }    
    
    /**
     * Broadcasts the specified message to all sprites.
     * 
     * @param {string} broadcast_name
     * The name of the broadcast message to send.
     */
    public broadcast(broadcast_name: string) {
        if (!this.sprite_list) return
        this.sprite_list.forEach(sprite => {
            sprite.recieve_broadcast(broadcast_name)
        });
    }

    /**
     * Adds a new backdrop image to the backdrop.
     * 
     * @param {string} backdrop_name
     * the name of the backdrop
     * @param {string} image_url
     * the URL of the backdrop image
     */
    public add_backdrop(backdrop_name: string, image_url: string) {
        this.backdrop_list[backdrop_name] = image_url
    }

    /**
     * Switches the backdrop's iamge to the given backdrop name if it exists.
     * 
     * @param {string} backdrop_name
     * The name of the backdrop to switch to.
     */
    public switch_costume(backdrop_name: string) {
        this.current_backdrop = backdrop_name
    }

    /**
     * Adds a sprite to the game's sprite list
     * 
     * @param {Sprite} sprite
     * The sprite object to add
     */
    public add_sprite(sprite: Sprite) {
        this.sprite_list.push(sprite)
    }

    /**
     * Draws an image with rotation at the specified position and size.
     *
     * @param {HTMLImageElement} image
     * The image to draw.
     * @param {number} x
     * The x-coordinate of the top-left corner where the image will be drawn.
     * @param {number} y
     * The y-coordinate of the top-left corner where the image will be drawn.
     * @param {number} width
     * The width to draw the image.
     * @param {number} height
     * The height to draw the image.
     * @param {number} deg
     * The rotation angle in degrees.
     */
    private draw_image_rotated(image: HTMLImageElement, x: number, y: number, width: number, height: number, deg: number){
        const ctx = this.canvas_context
        ctx.save()
        ctx.translate(x + width / 2, y + height / 2)
        ctx.rotate(deg * Math.PI / 180)
        ctx.drawImage(image, width / 2 * (-1), height / 2 * (-1), width, height)
        ctx.restore()
    }

    /**
     * Updates every sprite in the sprite list.
     */
    public render() {
        const ctx = this.canvas_context

		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        document.body.style.backgroundImage = `url(${this.backdrop_list[this.current_backdrop]})`

        for (const sprite of this.sprite_list) {
            if (sprite.isHidden) continue
            const sprite_image = sprite.get_current_costume_image()
            if (sprite_image) {
                ctx.filter = `brightness(${(sprite.Brightness+100)/2}%) hue-rotate(${sprite.Color}deg) opacity(${100-sprite.Ghost}%)`

                // Draw sprite
                const drawWidth = sprite_image.width * (sprite.Scale / 100)
                const drawHeight = sprite_image.height * (sprite.Scale / 100)
                this.draw_image_rotated(
                    sprite_image,
                    sprite.Position.x + this.canvas.width/2 - drawWidth / 2,
                    sprite.Position.y + this.canvas.height/2 - drawHeight / 2,
                    drawWidth,
                    drawHeight,
                    sprite.Direction
                )

                ctx.filter = ``
            }
        }
    }
}