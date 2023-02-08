import {
  argbFromHex,
  blueFromArgb,
  CorePalette,
  greenFromArgb,
  hexFromArgb,
  redFromArgb,
  TonalPalette
} from "@importantimport/material-color-utilities";
import { CssVarBuilder } from "./css-var-builder";
import { RgbColor } from "./rgb-color";
import { ThemeColor } from "./theme-color";

const elevationTintsOpacities = [.05, .08, .11, .12, .14];

function getElevationTints(): string {
  let tints = '';

  let elevationLevel = 1;
  for (const opacity of elevationTintsOpacities) {
    tints += `  --u-elevation-tint${elevationLevel}-color: rgba(var(--u-primary-color-rgb), var(--u-elevation-tint${elevationLevel}-opacity));
`
    elevationLevel++;
  }

  return tints;
}

function getCss(selector: string, content: string): string {
  return `${selector} {
${content}}`;
}

const themeMainColorsNames = ['secondary', 'tertiary'];


export class ThemeBuilder {
  cssClass: string | null;
  colors: ThemeColor[] = [];
  neutralColorPalette: TonalPalette | null = null;
  neutralVariantColorPalette: TonalPalette | null = null;

  private partial = false;

  private constructor() {
    this.cssClass = null;
  }

  static create(primaryColorHex: string): ThemeBuilder {
    return new ThemeBuilder()
      .addColor('primary', primaryColorHex);
  }

  static createPartial(): ThemeBuilder {
    const themeBuilder = new ThemeBuilder();
    themeBuilder.partial = true;

    return themeBuilder;
  }

  addColor(name: string, hex: string): ThemeBuilder {
    this.colors.push({name, tonalPalette: TonalPalette.fromInt(argbFromHex(hex))})
    return this;
  }

  setCssClass(cssClass: string): ThemeBuilder {
    this.cssClass = cssClass;
    return this;
  }

  private ensureCssClassStartsWithDot(): void {
    if (!this.cssClass || this.cssClass.startsWith('.')) {
      return;
    }

    this.cssClass = `.${this.cssClass}`;
  }

  private ensureThemeColors(): void {

    const primaryColor = this.colors.find(c => c.name === 'primary');

    const palette = CorePalette.of(primaryColor.tonalPalette.tone(40));

    if (!this.colors.find(c => c.name === 'secondary')) {
      this.colors.push({name: 'secondary', tonalPalette: palette.a2})
    }

    if (!this.colors.find(c => c.name === 'tertiary')) {
      this.colors.push({name: 'tertiary', tonalPalette: palette.a3})
    }

    if (!this.neutralColorPalette) {
      this.neutralColorPalette = palette.n1;
    }

    if (!this.neutralVariantColorPalette) {
      this.neutralVariantColorPalette = palette.n2;
    }
  }

  private getLightModeNeultralVariables(): string {
    return CssVarBuilder
      .create()
      .add('background', this.neutralColorPalette.tone(99))
      .add('on-background', this.neutralColorPalette.tone(10))
      .add('surface', this.neutralColorPalette.tone(99))
      .add('on-surface', this.neutralColorPalette.tone(10))
      .add('inverse-surface', this.neutralColorPalette.tone(10))
      .add('on-inverse-surface', this.neutralColorPalette.tone(90))
      .add('shadow', this.neutralColorPalette.tone(0))
      .add('scrim', this.neutralColorPalette.tone(0))
      .build();
  }

  private getDarkModeNeultralVariables(): string {
    return CssVarBuilder
      .create()
      .add('background', this.neutralColorPalette.tone(10))
      .add('on-background', this.neutralColorPalette.tone(90))
      .add('surface', this.neutralColorPalette.tone(10))
      .add('on-surface', this.neutralColorPalette.tone(90))
      .add('inverse-surface', this.neutralColorPalette.tone(99))
      .add('on-inverse-surface', this.neutralColorPalette.tone(10))
      .build();
  }

  private getNeultralVariantVariables(surfaceVariantTone: number, onSurfaceVariantTone: number, outlineTone: number, outlineVariantTone: number): string {
    return CssVarBuilder
      .create()
      .add('surface-variant', this.neutralVariantColorPalette.tone(surfaceVariantTone))
      .add('on-surface-variant', this.neutralVariantColorPalette.tone(onSurfaceVariantTone))
      .add('outline', this.neutralVariantColorPalette.tone(outlineTone))
      .add('outline-variant', this.neutralVariantColorPalette.tone(outlineVariantTone))
      .build()
  }

  getColorVariables(color: ThemeColor, colorTone: number, containerTone: number, onColorTone: number, onContainerTone: number): string {

    const tonalPalette = color.tonalPalette;

    const mainColor = tonalPalette.tone(colorTone);
    const containerColor = tonalPalette.tone(containerTone);
    const onColor = tonalPalette.tone(onColorTone);
    const onContainerColor = tonalPalette.tone(onContainerTone);

    const builder = CssVarBuilder
      .create()
      .add(color.name, mainColor)
      .add(`${color.name}-container`, containerColor)
      .add(`on-${color.name}`, onColor)
      .add(`on-${color.name}-container`, onContainerColor)

    if (color.name !== 'primary') {
      return builder.build();
    }

    return builder.build() + getElevationTints();
  }

  private getLightModeColorsVariables(): string {
    let variables = '';

    for (const color of this.colors) {
      variables += this.getColorVariables(color, 40, 90, 100, 10);
    }

    if (this.neutralColorPalette) {
      variables += this.getLightModeNeultralVariables();
    }

    if (this.neutralVariantColorPalette) {
      variables += this.getNeultralVariantVariables(90, 30, 50 , 80);
    }

    return variables;
  }

  private getDarkModeColorsVariables(): string {
    let variables = '';

    for (const color of this.colors) {
      variables += this.getColorVariables(color, 80, 30, 20, 90);
    }

    if (this.neutralColorPalette) {
      variables += this.getDarkModeNeultralVariables();
    }

    if (this.neutralVariantColorPalette) {
      variables += this.getNeultralVariantVariables(30, 80, 60, 30);
    }

    return variables;
  }

  private getCssVar(name: string, argb: number, generateRgbVar = true): string {

    let cssVar = `  --u-${name}-color: ${hexFromArgb(argb)};
`;

    if (!generateRgbVar) {
      return cssVar;
    }

    cssVar += `  --u-${name}-color-rgb: ${RgbColor.fromArgb(argb)};
`;

    return cssVar;
  }

  build(): string {

    this.ensureCssClassStartsWithDot();

    const lightCssClass = this.cssClass ?? ':root';
    const darkCssClass = this.cssClass
      ? `${this.cssClass}.u-dark-mode,
${this.cssClass} .u-dark-mode`
      : '.u-dark-mode';

    if (!this.partial) {
      this.ensureThemeColors();
    }


    let variables = `${getCss(lightCssClass, this.getLightModeColorsVariables())}

${getCss(darkCssClass, this.getDarkModeColorsVariables())}
`;
    return variables;
  }
}
