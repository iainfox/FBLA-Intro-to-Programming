import Sprite from '../ts/Sprite.js'
import Game from '../ts/Game.js'

async function load_image(img_path: string) : Promise<HTMLImageElement> {
    const image = new Image();
    return new Promise<HTMLImageElement>((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = "../../temp.jpg";
    });
}

const canvas = document.getElementById("a") as HTMLCanvasElement | null;
if (!canvas) throw new Error("Canvas element with id 'a' not found.");

const image = await load_image("../../temp.jpg");
const image2 = await load_image("../../temp.jpg");

const sprite = new Sprite(image, "costume1");
sprite.set_size_to_x(20);
const game = new Game(new Sprite(image2, "backdrop1"), canvas);

game.add_sprite(sprite);
function loop() {
    game.render();
    requestAnimationFrame(loop);
}
loop();