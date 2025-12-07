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

const image = await load_image("../../../temp.jpg");

const sprite = new Sprite(image, "costume1");
sprite.set_size_to_x(200);
const game = new Game("backdrop1", "../../../temp.jpg", document.getElementById("a"));

game.add_sprite(sprite);

sprite.add_forever_callback(() => sprite.set_x_to(Math.sin(game.currentFrameCount/2)*20))

game.start_loop()