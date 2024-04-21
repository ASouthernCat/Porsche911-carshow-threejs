import * as TEXTURE from '../texture/index.js'

const Style = {
    default:{
        envMap: TEXTURE.envMap,
        backgroundIntensity: 1.3,
        ambientLightIntensity: 1, // 光照强度
        directionalLightIntensity: 4,
        fogColor: 0xadd5ff,
        envMapIntensity: 0.4, // 环境贴图强度
    },
}

export default Style