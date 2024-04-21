import * as THREE from 'three'
/**
 * 纹理贴图
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
export const envMap = cubeTextureLoader.setPath(import.meta.env.BASE_URL+'texture/envmap/',).load([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png",
])
envMap.mapping = THREE.CubeRefractionMapping
const textureLoader = new THREE.TextureLoader()
export let skyTextureEquirec = textureLoader.load(import.meta.env.BASE_URL+'texture/envmap/room.png');
skyTextureEquirec.mapping = THREE.EquirectangularReflectionMapping;
skyTextureEquirec.colorSpace = THREE.SRGBColorSpace;

export function disposeTexture() {
    envMap.dispose()
    skyTextureEquirec.dispose()
}