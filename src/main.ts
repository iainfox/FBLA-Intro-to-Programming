import Sprite from './ts/Sprite.js'

const image = document.getElementById('temp') as HTMLImageElement | null
if (!image) {
  throw new Error('Image element with id "temp" not found')
}

const sprite = new Sprite(image)
sprite.go_to_xy(0, 0)

let mouseX = 0;
let mouseY = 0;

window.onmousemove = (event: MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX = event.clientX - centerX;
    mouseY = centerY - event.clientY;
    
    sprite.point_in_direction_xy(mouseX, mouseY);
};

setInterval(() => {
    sprite.point_in_direction_xy(mouseX, mouseY);
    sprite.move_x_steps(10)
    sprite.change_y_by(-1)
}, 1000)
