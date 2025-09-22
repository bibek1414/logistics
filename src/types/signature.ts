export interface SignatureColor {
  name: string;
  color: string;
  label: string;
}

export interface SignatureFont {
  name: string;
  family: string;
  variable: string;
}

export enum SignatureTabs {
  DRAW = "draw",
  TYPE = "type",
  UPLOAD = "upload",
}
