import { hexFromArgb } from '@importantimport/material-color-utilities';
import { RgbColor } from './rgb-color';

export class CssVarBuilder {

  private content = '';

  private constructor() {
  }

  static create():CssVarBuilder {
    return new CssVarBuilder();
  }

  add(name: string, argb: number): CssVarBuilder {

    let cssVar = `  --u-${name}-color: ${hexFromArgb(argb)};
  --u-${name}-color-rgb: ${RgbColor.fromArgb(argb)};
`;

    this.content += cssVar

    return this;
  }

  build(): string {
    return this.content;
  }
}
