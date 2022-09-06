import { BitEnumerator } from './BitEnumerator';
import { Color } from './Color';
import { Colors, grayscale, spectrum, spectrum_cmyk_safe } from './constants';
import { HSBColor } from './HSBColor';
import { modulo, lerp } from './math-utils';
import { LifeHashVersion } from './types/LifeHashVersion';
import { reverse } from './utils';

function select_grayscale(entropy: BitEnumerator) {
  if (entropy.next()) {
    return grayscale;
  } else {
    return reverse(grayscale);
  }
}

function make_hue(t: number): Color {
  return new HSBColor(t).to_color();
}

export function blend(color1: Color, color2: Color): (t: number) => Color {
  function blendanonfunc(t: number): Color {
    return color1.lerp_to(color2, t);
  }

  return blendanonfunc;
}

export function blend_many(colors: Color[]) {
  const color_count = colors.length;

  if (color_count === 0) {
    return blend(Colors.black, Colors.black);
  } else {
    if (color_count === 1) {
      return blend(colors[0], colors[0]);
    } else {
      if (color_count === 2) {
        return blend(colors[0], colors[1]);
      } else {
        function blendmanyanonfunc(t: number) {
          let c1;
          let c2;
          let s;
          let segment;
          let segment_frac;
          let segments;

          if (t >= 1) {
            return colors[color_count - 1];
          } else {
            if (t <= 0) {
              return colors[0];
            } else {
              segments = color_count - 1;
              s = t * segments;
              segment = Number.parseInt(s as any);
              segment_frac = modulo(s, 1);
              c1 = colors[segment];
              c2 = colors[segment + 1];
              return c1.lerp_to(c2, segment_frac);
            }
          }
        }

        return blendmanyanonfunc;
      }
    }
  }
}

function adjust_for_luminance(color: Color, contrast_color: Color) {
  let boost;
  let contrast_lum;
  let lum;
  let offset;
  let t;
  let threshold;
  lum = color.luminance();
  contrast_lum = contrast_color.luminance();
  threshold = 0.6;
  offset = Math.abs(lum - contrast_lum);

  if (offset > threshold) {
    return color;
  }

  boost = 0.7;
  t = lerp(0, threshold, boost, 0, offset);

  if (contrast_lum > lum) {
    return color.darken(t).burn(t * 0.6);
  } else {
    return color.lighten(t).burn(t * 0.6);
  }
}

function monochromatic(
  entropy: BitEnumerator,
  hue_generator: (t: number) => Color,
): (t: number) => Color {
  let contrast_brightness;
  let gradient;
  let hue;
  let is_reversed;
  let is_tint;
  let key_advance;
  let key_color;
  let key_color_2;
  let neutral_advance;
  let neutral_color;
  let neutral_color_2;
  hue = entropy.next_frac();
  is_tint = entropy.next();
  is_reversed = entropy.next();
  key_advance = entropy.next_frac() * 0.3 + 0.05;
  neutral_advance = entropy.next_frac() * 0.3 + 0.05;
  key_color = hue_generator(hue);
  contrast_brightness = null;

  if (is_tint) {
    contrast_brightness = 1;
    key_color = key_color.darken(0.5);
  } else {
    contrast_brightness = 0;
  }

  neutral_color = grayscale(contrast_brightness);
  key_color_2 = key_color.lerp_to(neutral_color, key_advance);
  neutral_color_2 = neutral_color.lerp_to(key_color, neutral_advance);
  gradient = blend(key_color_2, neutral_color_2);

  if (is_reversed) {
    return reverse(gradient);
  } else {
    return gradient;
  }
}

function monochromatic_fiducial(entropy: BitEnumerator) {
  let contrast_color;
  let gradient;
  let hue;
  let is_reversed;
  let is_tint;
  let key_color;
  hue = entropy.next_frac();
  is_reversed = entropy.next();
  is_tint = entropy.next();
  contrast_color = is_tint ? Colors.white : Colors.black;
  key_color = adjust_for_luminance(spectrum_cmyk_safe(hue), contrast_color);
  gradient = blend_many([key_color, contrast_color, key_color]);

  if (is_reversed) {
    return reverse(gradient);
  } else {
    return gradient;
  }
}

function complementary(
  entropy: BitEnumerator,
  hue_generator: (t: number) => Color,
) {
  let adjusted_darker_color;
  let adjusted_lighter_color;
  let color1;
  let color2;
  let darker_advance;
  let darker_color;
  let gradient;
  let is_reversed;
  let lighter_advance;
  let lighter_color;
  let luma1;
  let luma2;
  let spectrum1;
  let spectrum2;
  spectrum1 = entropy.next_frac();
  spectrum2 = modulo(spectrum1 + 0.5, 1);
  lighter_advance = entropy.next_frac() * 0.3;
  darker_advance = entropy.next_frac() * 0.3;
  is_reversed = entropy.next();
  color1 = hue_generator(spectrum1);
  color2 = hue_generator(spectrum2);
  luma1 = color1.luminance();
  luma2 = color2.luminance();
  darker_color = null;
  lighter_color = null;

  if (luma1 > luma2) {
    darker_color = color2;
    lighter_color = color1;
  } else {
    darker_color = color1;
    lighter_color = color2;
  }

  adjusted_lighter_color = lighter_color.lighten(lighter_advance);
  adjusted_darker_color = darker_color.darken(darker_advance);
  gradient = blend(adjusted_darker_color, adjusted_lighter_color);

  if (is_reversed) {
    return reverse(gradient);
  } else {
    return gradient;
  }
}

function complementary_fiducial(entropy: BitEnumerator) {
  let biased_neutral_color;
  let color1;
  let color2;
  let gradient;
  let is_reversed;
  let is_tint;
  let neutral_color;
  let neutral_color_bias;
  let spectrum1;
  let spectrum2;
  spectrum1 = entropy.next_frac();
  spectrum2 = modulo(spectrum1 + 0.5, 1);
  is_tint = entropy.next();
  is_reversed = entropy.next();
  neutral_color_bias = entropy.next();
  neutral_color = is_tint ? Colors.white : Colors.black;
  color1 = spectrum_cmyk_safe(spectrum1);
  color2 = spectrum_cmyk_safe(spectrum2);
  biased_neutral_color = neutral_color
    .lerp_to(neutral_color_bias ? color1 : color2, 0.2)
    .burn(0.1);
  gradient = blend_many([
    adjust_for_luminance(color1, biased_neutral_color),
    biased_neutral_color,
    adjust_for_luminance(color2, biased_neutral_color),
  ]);

  if (is_reversed) {
    return reverse(gradient);
  } else {
    return gradient;
  }
}

function triadic(entropy: BitEnumerator, hue_generator: (t: number) => Color) {
  let adjusted_darker_color;
  let adjusted_lighter_color;
  let color1;
  let color2;
  let color3;
  let colors;
  let darker_advance;
  let darker_color;
  let gradient;
  let is_reversed;
  let lighter_advance;
  let lighter_color;
  let middle_color;
  let spectrum1;
  let spectrum2;
  let spectrum3;
  spectrum1 = entropy.next_frac();
  spectrum2 = modulo(spectrum1 + 1.0 / 3, 1);
  spectrum3 = modulo(spectrum1 + 2.0 / 3, 1);
  lighter_advance = entropy.next_frac() * 0.3;
  darker_advance = entropy.next_frac() * 0.3;
  is_reversed = entropy.next();
  color1 = hue_generator(spectrum1);
  color2 = hue_generator(spectrum2);
  color3 = hue_generator(spectrum3);
  colors = [color1, color2, color3];

  function comparison(a: Color, b: Color): number {
    // TODO: MY CHANGE. MAYBE SWITCH?
    return a.luminance() - b.luminance();
  }

  colors = colors.sort(comparison);

  darker_color = colors[0];
  middle_color = colors[1];
  lighter_color = colors[2];
  adjusted_lighter_color = lighter_color.lighten(lighter_advance);
  adjusted_darker_color = darker_color.darken(darker_advance);
  gradient = blend_many([
    adjusted_lighter_color,
    middle_color,
    adjusted_darker_color,
  ]);

  if (is_reversed) {
    return reverse(gradient);
  } else {
    return gradient;
  }
}

function triadic_fiducial(entropy: BitEnumerator) {
  let colors;
  let gradient;
  let is_reversed;
  let is_tint;
  let neutral_color;
  let neutral_insert_index;
  let spectrum1;
  let spectrum2;
  let spectrum3;
  spectrum1 = entropy.next_frac();
  spectrum2 = modulo(spectrum1 + 1.0 / 3, 1);
  spectrum3 = modulo(spectrum1 + 2.0 / 3, 1);
  is_tint = entropy.next();
  neutral_insert_index = (entropy.next_uint8() % 2) + 1;
  is_reversed = entropy.next();
  neutral_color = is_tint ? Colors.white : Colors.black;
  colors = [
    spectrum_cmyk_safe(spectrum1),
    spectrum_cmyk_safe(spectrum2),
    spectrum_cmyk_safe(spectrum3),
  ];

  if (neutral_insert_index === 1) {
    colors[0] = adjust_for_luminance(colors[0], neutral_color);
    colors[1] = adjust_for_luminance(colors[1], neutral_color);
    colors[2] = adjust_for_luminance(colors[2], colors[1]);
  } else {
    if (neutral_insert_index === 2) {
      colors[1] = adjust_for_luminance(colors[1], neutral_color);
      colors[2] = adjust_for_luminance(colors[2], neutral_color);
      colors[0] = adjust_for_luminance(colors[0], colors[1]);
    } else {
      throw new Error('Internal error.');
    }
  }

  colors[neutral_insert_index] = neutral_color;

  gradient = blend_many(colors);

  if (is_reversed) {
    return reverse(gradient);
  } else {
    return gradient;
  }
}

function analogous(
  entropy: BitEnumerator,
  hue_generator: (t: number) => Color,
) {
  let adjusted_dark_color;
  let adjusted_darkest_color;
  let adjusted_light_color;
  let adjusted_lightest_color;
  let advance;
  let color1;
  let color2;
  let color3;
  let color4;
  let dark_color;
  let darkest_color;
  let gradient;
  let is_reversed;
  let light_color;
  let lightest_color;
  let spectrum1;
  let spectrum2;
  let spectrum3;
  let spectrum4;
  spectrum1 = entropy.next_frac();
  spectrum2 = modulo(spectrum1 + 1.0 / 12, 1);
  spectrum3 = modulo(spectrum1 + 2.0 / 12, 1);
  spectrum4 = modulo(spectrum1 + 3.0 / 12, 1);
  advance = entropy.next_frac() * 0.5 + 0.2;
  is_reversed = entropy.next();
  color1 = hue_generator(spectrum1);
  color2 = hue_generator(spectrum2);
  color3 = hue_generator(spectrum3);
  color4 = hue_generator(spectrum4);
  [darkest_color, dark_color, light_color, lightest_color] = [
    null,
    null,
    null,
    null,
  ];

  if (color1.luminance() < color4.luminance()) {
    darkest_color = color1;
    dark_color = color2;
    light_color = color3;
    lightest_color = color4;
  } else {
    darkest_color = color4;
    dark_color = color3;
    light_color = color2;
    lightest_color = color1;
  }

  adjusted_darkest_color = darkest_color.darken(advance);
  adjusted_dark_color = dark_color.darken(advance / 2);
  adjusted_light_color = light_color.lighten(advance / 2);
  adjusted_lightest_color = lightest_color.lighten(advance);
  gradient = blend_many([
    adjusted_darkest_color,
    adjusted_dark_color,
    adjusted_light_color,
    adjusted_lightest_color,
  ]);

  if (is_reversed) {
    return reverse(gradient);
  } else {
    return gradient;
  }
}

function analogous_fiducial(entropy: BitEnumerator) {
  let colors;
  let gradient;
  let is_reversed;
  let is_tint;
  let neutral_color;
  let neutral_insert_index;
  let spectrum1;
  let spectrum2;
  let spectrum3;
  spectrum1 = entropy.next_frac();
  spectrum2 = modulo(spectrum1 + 1.0 / 10, 1);
  spectrum3 = modulo(spectrum1 + 2.0 / 10, 1);
  is_tint = entropy.next();
  neutral_insert_index = (entropy.next_uint8() % 2) + 1;
  is_reversed = entropy.next();
  neutral_color = is_tint ? Colors.white : Colors.black;
  colors = [
    spectrum_cmyk_safe(spectrum1),
    spectrum_cmyk_safe(spectrum2),
    spectrum_cmyk_safe(spectrum3),
  ];

  if (neutral_insert_index === 1) {
    colors[0] = adjust_for_luminance(colors[0], neutral_color);
    colors[1] = adjust_for_luminance(colors[1], neutral_color);
    colors[2] = adjust_for_luminance(colors[2], colors[1]);
  } else {
    if (neutral_insert_index === 2) {
      colors[1] = adjust_for_luminance(colors[1], neutral_color);
      colors[2] = adjust_for_luminance(colors[2], neutral_color);
      colors[0] = adjust_for_luminance(colors[0], colors[1]);
    } else {
      throw new Error('Internal error');
    }
  }

  colors[neutral_insert_index] = neutral_color;

  gradient = blend_many(colors);

  if (is_reversed) {
    return reverse(gradient);
  } else {
    return gradient;
  }
}

export function select_gradient(
  entropy: BitEnumerator,
  version: LifeHashVersion,
) {
  /*
    A function that takes a deterministic source of bits and selects a gradient
    used to color a particular Lifehash version. This function itself returns
    another function.
    */
  let value;

  if (version === LifeHashVersion.grayscale_fiducial) {
    return select_grayscale(entropy);
  }

  value = entropy.next_uint2();

  if (value === 0) {
    if (version === LifeHashVersion.version1) {
      return monochromatic(entropy, make_hue);
    } else {
      if (
        version === LifeHashVersion.version2 ||
        version === LifeHashVersion.detailed
      ) {
        return monochromatic(entropy, spectrum_cmyk_safe);
      } else {
        if (version === LifeHashVersion.fiducial) {
          return monochromatic_fiducial(entropy);
        } else {
          if (version === LifeHashVersion.grayscale_fiducial) {
            return grayscale;
          }
        }
      }
    }
  } else {
    if (value === 1) {
      if (version === LifeHashVersion.version1) {
        return complementary(entropy, spectrum);
      } else {
        if (
          version === LifeHashVersion.version2 ||
          version === LifeHashVersion.detailed
        ) {
          return complementary(entropy, spectrum_cmyk_safe);
        } else {
          if (version === LifeHashVersion.fiducial) {
            return complementary_fiducial(entropy);
          } else {
            if (version === LifeHashVersion.grayscale_fiducial) {
              return grayscale;
            }
          }
        }
      }
    } else {
      if (value === 2) {
        if (version === LifeHashVersion.version1) {
          return triadic(entropy, spectrum);
        } else {
          if (
            version === LifeHashVersion.version2 ||
            version === LifeHashVersion.detailed
          ) {
            return triadic(entropy, spectrum_cmyk_safe);
          } else {
            if (version === LifeHashVersion.fiducial) {
              return triadic_fiducial(entropy);
            } else {
              if (version === LifeHashVersion.grayscale_fiducial) {
                return grayscale;
              }
            }
          }
        }
      } else {
        if (value === 3) {
          if (version === LifeHashVersion.version1) {
            return analogous(entropy, spectrum);
          } else {
            if (
              version === LifeHashVersion.version2 ||
              version === LifeHashVersion.detailed
            ) {
              return analogous(entropy, spectrum_cmyk_safe);
            } else {
              if (version === LifeHashVersion.fiducial) {
                return analogous_fiducial(entropy);
              } else {
                if (version === LifeHashVersion.grayscale_fiducial) {
                  return grayscale;
                }
              }
            }
          }
        }
      }
    }
  }

  return grayscale;
}
