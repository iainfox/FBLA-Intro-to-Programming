import Sprite from './ts/Sprite.js'

const image = document.getElementById('temp') as HTMLImageElement | null
if (!image) {
  throw new Error('Image element with id "temp" not found')
}

const sprite = new Sprite(image)
sprite.go_to_xy(0, 0)

setInterval(() => {
  sprite.move_x_steps(10)
  sprite.change_y_by(-1)
}, 1000)
