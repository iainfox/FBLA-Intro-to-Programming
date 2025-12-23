import Sprite from '../../ts/Sprite.js'
import Game from '../../ts/Game.js'

const image = await Game.load_image("../../../temp.jpg");

const sprite = new Sprite(image, "costume1");
sprite.set_size_to_x(200);
const game = new Game("backdrop1", "../../../temp.jpg", document.getElementById("a"));

game.add_sprite(sprite);

sprite.add_forever_callback(() => {
    sprite.set_x_to(Math.sin(game.currentFrameCount/2)*20)
    sprite.point_in_direction(game.currentFrameCount%360)
})

game.start_loop(60)