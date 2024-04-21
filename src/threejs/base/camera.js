import { PerspectiveCamera } from "three";
import { sizes } from "../system/sizes";
function createCamera(){
    const camera = new PerspectiveCamera(50, sizes.width / sizes.height, 1, 2000)
    camera.position.set(-3.67, 1.46, 3.23)
    return camera
}
export {createCamera }