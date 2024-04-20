import { Resource } from '../experience/utils/Resources';

export default [
  {
    name: 'mapTexture',
    type: 'texture',
    path: 'textures/map_texture.png'
  },
  {
    name: 'introBackground',
    type: 'texture',
    path: 'textures/introBackground.png'
  },
  {
    name: 'skull',
    type: 'texture',
    path: 'textures/skull.png'
  },
  {
    name: 'skullTileset',
    type: 'texture',
    path: 'textures/skullTileset.png'
  },
  ...Array(10)
    .fill(0)
    .map(
      (_, idx): Resource => ({
        name: `cloud${idx + 1}`,
        type: 'texture',
        path: `textures/clouds/cloud${idx + 1}.png`
      })
    )
] as Resource[];
