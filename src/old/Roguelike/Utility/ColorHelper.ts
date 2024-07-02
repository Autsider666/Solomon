export class ColorHelper {
    static White = '#ffedb2';
    static Black = '#121723';

    // 0xFFFFFF -> 'FFFFFF'
    static intToHexString(hex: number): string {
        return '#' + hex.toString(16);
    }

    // 'FFFFFF' -> 0xFFFFFF
    static hexStringToInt(string: string): number {
        return parseInt('0x' + string.replace('#', ''));
    }

    // produce a new color from (sharePercent 0.0->1.0, color1, optional color 2)
    // Accepts '#FFFFFF' color string values
    static shadeBlend(p: number, c0: string, c1?: string): string {
        const n = p < 0 ? p * -1 : p;
        if (c0.length > 7) {
            const f = c0.split(",");
            const t = (c1 ? c1 : p < 0 ? "rgb(0,0,0)" : "rgb(255,255,255)").split(",");
            const R = parseInt(f[0].slice(4));
            const G = parseInt(f[1]);
            const B = parseInt(f[2]);
            return "rgb(" + (Math.round((parseInt(t[0].slice(4)) - R) * n) + R) + "," + (Math.round((parseInt(t[1]) - G) * n) + G) + "," + (Math.round((parseInt(t[2]) - B) * n) + B) + ")";
        } else {
            const f = parseInt(c0.slice(1), 16);
            const t = parseInt((c1 ? c1 : p < 0 ? "#000000" : "#FFFFFF").slice(1), 16);
            const R1 = f >> 16, G1 = f >> 8 & 0x00FF;
            const B1 = f & 0x0000FF;
            return "#" + (0x1000000 + (Math.round(((t >> 16) - R1) * n) + R1) * 0x10000 + (Math.round(((t >> 8 & 0x00FF) - G1) * n) + G1) * 0x100 + (Math.round(((t & 0x0000FF) - B1) * n) + B1)).toString(16).slice(1);
        }
    }

    // Same as above but accepts 0xFFFFFF int hex values
    static shadeBlendInt(percent: number, color1: number, color2?: number) {
        const color1Str: string = this.intToHexString(color1);
        let color2Str: string | undefined = undefined;
        if (color2) {
            color2Str = this.intToHexString(color2);
        }
        return this.hexStringToInt(this.shadeBlend(percent, color1Str, color2Str));
    }
}