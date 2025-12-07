import Sprite from '../../ts/Sprite.js'
import Game from '../../ts/Game.js'

async function load_image(img_path: string) : Promise<HTMLImageElement> {
    const image = new Image();
    return new Promise<HTMLImageElement>((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = img_path;
    });
}

const image = await load_image("../../../temp.jpg")

const sprite = new Sprite(image, "costume1")
const game = new Game("backdrop1", "../../../temp.jpg", document.getElementById("a"))
sprite.set_size_to_x(50)
game.add_sprite(sprite)

window.addEventListener("mousemove", (e) => {
    sprite.set_x_to(e.clientX-window.innerWidth/2)
    sprite.set_y_to(e.clientY-window.innerHeight/2)
})

game.start_loop()