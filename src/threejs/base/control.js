import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
export function createControl(camera, canvas) {
    const control = new OrbitControls(camera, canvas)
    control.maxPolarAngle = Math.PI * 0.5
    // control.minPolarAngle = 0.1
    control.minDistance = 4
    control.maxDistance = 15
    control.screenSpacePanning = false
    control.target.set(0.2, 0, 0.3)
    control.enableDamping = true
    control.dampingFactor = 0.05
    // control.enablePan = false
    return control
}