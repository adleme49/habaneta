// Static registry of ambient scenes.
//
// Ambients are background images (usually a photo of a room with an
// empty floor area) that the user's designed tile grid is composited
// on top of in the Environment modal for context/marketing-style
// screenshots. New ambients just need to drop a PNG/JPG under
// public/assets/Enviroment/ and get a line here.
//
// `labelKey` is an i18n key — resolve at display time via useTranslation.

export type AmbientId = 'bathroom' | 'kitchen';

export interface Ambient {
  id: AmbientId;
  labelKey: string;
  imgUrl: string;
}

export const ambients: Ambient[] = [
  {
    id: 'bathroom',
    labelKey: 'ambient.bathroom',
    imgUrl: '/assets/Enviroment/bano.png',
  },
  {
    id: 'kitchen',
    labelKey: 'ambient.kitchen',
    imgUrl: '/assets/Enviroment/cocina.png',
  },
];

export const DEFAULT_AMBIENT_ID: AmbientId = 'bathroom';

export function findAmbient(id: AmbientId): Ambient {
  return ambients.find((a) => a.id === id) ?? ambients[0];
}
