const targetColorHex = '#840624';

// Helper classes to calculate color differences and run optimization
class Color {
  constructor(r, g, b) {
    this.r = this.clamp(r);
    this.g = this.clamp(g);
    this.b = this.clamp(b);
  }

  clamp(value) {
    if (value < 0) return 0;
    if (value > 255) return 255;
    return value;
  }

  multiply(f) {
    return new Color(this.r * f, this.g * f, this.b * f);
  }

  add(color) {
    return new Color(this.r + color.r, this.g + color.g, this.b + color.b);
  }

  set(r, g, b) {
    this.r = this.clamp(r);
    this.g = this.clamp(g);
    this.b = this.clamp(b);
  }
}

class Solver {
  constructor(target) {
    this.target = target;
    this.targetHSL = this.rgbToHsl(target.r, target.g, target.b);
    this.targetHex = targetColorHex;
  }

  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  solve() {
    let result = this.solveNarrow([0, 0, 0, 0, 0, 0]);
    return result;
  }

  solveNarrow(filters) {
    const lossFunction = (f) => {
      let color = new Color(0, 0, 0); // start black
      // invert
      let inv = f[0] / 100;
      color.r = 255 * inv;
      color.g = 255 * inv;
      color.b = 255 * inv;
      
      // sepia
      let sep = f[1] / 100;
      let r = color.r, g = color.g, b = color.b;
      color.r = (r * (1 - (0.607 * sep))) + (g * (0.769 * sep)) + (b * (0.189 * sep));
      color.g = (r * (0.349 * sep)) + (g * (1 - (0.314 * sep))) + (b * (0.168 * sep));
      color.b = (r * (0.272 * sep)) + (g * (0.534 * sep)) + (b * (1 - (0.869 * sep)));
      
      // saturate
      let sat = f[2] / 100;
      let gray = (color.r + color.g + color.b) / 3;
      color.r = gray + (color.r - gray) * sat;
      color.g = gray + (color.g - gray) * sat;
      color.b = gray + (color.b - gray) * sat;
      
      // hue-rotate
      let hue = f[3];
      let hsl = this.rgbToHsl(color.r, color.g, color.b);
      hsl.h = (hsl.h + hue) % 360;
      if (hsl.h < 0) hsl.h += 360;
      color = this.hslToRgb(hsl.h, hsl.s, hsl.l);
      
      // brightness
      let bri = f[4] / 100;
      color = color.multiply(bri);
      
      // contrast
      let con = f[5] / 100;
      let intercept = 255 * 0.5 * (1 - con);
      color.r = color.r * con + intercept;
      color.g = color.g * con + intercept;
      color.b = color.b * con + intercept;
      
      // compute loss
      let hslColor = this.rgbToHsl(color.r, color.g, color.b);
      let dH = Math.abs(hslColor.h - this.targetHSL.h);
      if (dH > 180) dH = 360 - dH;
      let dS = Math.abs(hslColor.s - this.targetHSL.s);
      let dL = Math.abs(hslColor.l - this.targetHSL.l);
      
      return dH * 1.5 + dS * 0.5 + dL * 1.0;
    };

    // Nelder-Mead optimization
    let bestLoss = Infinity;
    let bestFilters = [];

    // Simple random search + hill climbing
    for (let i = 0; i < 200000; i++) {
      let f = [
        Math.random() * 100, // invert (0-100)
        Math.random() * 100, // sepia (0-100)
        Math.random() * 8000, // saturate (0-8000)
        Math.random() * 360, // hue-rotate (0-360)
        Math.random() * 200, // brightness (0-200)
        Math.random() * 200 // contrast (0-200)
      ];
      let loss = lossFunction(f);
      if (loss < bestLoss) {
        bestLoss = loss;
        bestFilters = f;
      }
    }

    // Refinement
    let step = 1;
    for (let iter = 0; iter < 10; iter++) {
      for (let i = 0; i < 6; i++) {
        let test1 = [...bestFilters];
        test1[i] += step;
        let l1 = lossFunction(test1);
        if (l1 < bestLoss) {
          bestLoss = l1;
          bestFilters = test1;
        }

        let test2 = [...bestFilters];
        test2[i] -= step;
        let l2 = lossFunction(test2);
        if (l2 < bestLoss) {
          bestLoss = l2;
          bestFilters = test2;
        }
      }
      step *= 0.5;
    }

    return {
      loss: bestLoss,
      values: bestFilters.map(v => Math.round(v * 100) / 100)
    };
  }

  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return new Color(r * 255, g * 255, b * 255);
  }
}

// Convert Hex Target #840624 to RGB
const targetRGB = new Color(132, 6, 36);
const solver = new Solver(targetRGB);
const res = solver.solve();

console.log('Target Hex:', targetColorHex);
console.log('Loss:', res.loss);
console.log(`filter: brightness(0) saturate(100%) invert(${res.values[0]}%) sepia(${res.values[1]}%) saturate(${res.values[2]}%) hue-rotate(${res.values[3]}deg) brightness(${res.values[4]}%) contrast(${res.values[5]}%);`);
