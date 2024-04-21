import * as THREE from 'three';
import { gui } from '../system/gui';

/**
 * 
 * @param {THREE.Scene} scene 
 */
function createDynamicEnv(scene) {

    // environment
    const group = new THREE.Group()
    group.name = "dynamicEnv"
    scene.userData.dynamicEnv = group
    scene.add(group)
    const rect = new THREE.Mesh(new THREE.PlaneGeometry(2,5), new THREE.MeshBasicMaterial({
        color: '#fff',
        side: THREE.DoubleSide,
    }))
    rect.position.set(3, 2, 0)
    rect.rotation.set( - Math.PI * 0.5, Math.PI * 0.1, 0 )
    rect.name = "rect"
    rect.userData.update = (deltaTime,elapsedTime)=>{
        rect.position.y = Math.abs(Math.sin(elapsedTime * 0.5)) + 1
        rect.position.z = 0.5 * Math.sin(elapsedTime * 0.5)
    }

    const rect2 = new THREE.Mesh(new THREE.PlaneGeometry(5,5), new THREE.MeshBasicMaterial({
        color: '#5c67ff',
        side: THREE.DoubleSide,
    }))
    rect2.rotation.set(-Math.PI * 0.2, - Math.PI * 0.3, -Math.PI * 0.2)
    rect2.position.set(-3.5, 0, 0)

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({
        color: '#5a509f',
        side: THREE.BackSide,
    }))

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
        color: '#66edff',
        // side: THREE.FrontSide,
    }))
    cube.userData.update = (deltaTime,elapsedTime)=>{
        cube.position.x = 1 * Math.sin(elapsedTime ) - 1
        cube.position.y = Math.sin(elapsedTime) + 1.5
        cube.position.z = Math.cos(elapsedTime) - 1
    }

    const ring = new THREE.Mesh(new THREE.CylinderGeometry(2,2,0.5,16,1,true), new THREE.MeshBasicMaterial({
        color: '#fafeff',
        side: THREE.DoubleSide,
    }))
    ring.rotation.set(Math.PI * 0.5, 0, 0)
    ring.userData.update = (deltaTime,elapsedTime)=>{
        ring.position.z += 2 * deltaTime
        if(ring.position.z > 4){
            ring.position.z = -5
        }
    }

    group.add(rect, rect2, sphere, cube,ring)

    group.children.forEach(item=>{
        item.layers.set(scene.userData.rtCubeCameraLayer)
    })

    // debug
    // gui.add(group.position, 'x').step(0.01).name('groupX')
    // gui.add(group.position, 'y').step(0.01).name('groupY')
    // gui.add(group.position, 'z').step(0.01).name('groupZ')
    // gui.add(rect.position, 'x').step(0.01).name('rectX')
    // gui.add(rect.position, 'y').step(0.01).name('rectY')
    // gui.add(rect.position, 'z').step(0.01).name('rectZ')
    // gui.add(rect2.position, 'x').step(0.01).name('rect2X')
    // gui.add(rect2.position, 'y').step(0.01).name('rect2Y')
    // gui.add(rect2.position, 'z').step(0.01).name('rect2Z')
    // gui.add(cube.position, 'x').step(0.01).name('cubeX')
    // gui.add(cube.position, 'y').step(0.01).name('cubeY')
    // gui.add(cube.position, 'z').step(0.01).name('cubeZ')
    // gui.add(ring.position, 'x').step(0.01).name('ringX')
    // gui.add(ring.position, 'y').step(0.01).name('ringY')
    // gui.add(ring.position, 'z').step(0.01).name('ringZ')
    gui.addColor(rect.material, 'color').name('rectColor')
    gui.addColor(rect2.material, 'color').name('rect2Color')
    gui.addColor(sphere.material, 'color').name('sphereColor')
    gui.addColor(cube.material, 'color').name('cubeColor')
}

export { createDynamicEnv }
