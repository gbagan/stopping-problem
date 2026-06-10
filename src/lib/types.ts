export interface GiftColor {
  box: string;
  ribbon: string;
}
 
export interface Gift {
  id: number;
  x: number;
  speed: number;
  opened: boolean;
  color: GiftColor;
  width: number;
  height: number;
}
 
export interface StarParticle {
  id: number;
  cx: number;
  particles: { tx: number; ty: number; dur: number; rot: number; delay: number }[];
}
 