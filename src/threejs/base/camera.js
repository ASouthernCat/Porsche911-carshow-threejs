import { PerspectiveCamera } from "three";
import { sizes } from "../system/sizes";
function createCamera(){
    const camera = new PerspectiveCamera(50, sizes.width / sizes.height, 1, 2000)
    camera.position.set(-2.95, 1.33, 3.91)
    return camera
}
export {createCamera }