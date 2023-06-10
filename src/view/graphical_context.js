
export class GraphicalContext {
    constructor(ctx) {
        this.ctx = ctx;
    }

    drawCircle(pixel, radius=5, color='red') {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawLine(pixelFrom, pixelTo, lineWidth, color) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(pixelFrom.x, pixelFrom.y);
        this.ctx.lineTo(pixelTo.x, pixelTo.y);
        this.ctx.stroke();
        this.ctx.closePath();    
        this.ctx.restore();
    }

    hilightHex(size, pixelCoordinate) {
        let x = size.x-10;
        let y = size.y-2;
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = 'lightgreen';
        this.ctx.beginPath();
        this.ctx.moveTo(pixelCoordinate.x, pixelCoordinate.y);
        this.ctx.lineTo(pixelCoordinate.x, pixelCoordinate.y - y);
        this.ctx.lineTo(pixelCoordinate.x + x, pixelCoordinate.y - y / 2);
        this.ctx.lineTo(pixelCoordinate.x + x, pixelCoordinate.y + y / 2);
        this.ctx.lineTo(pixelCoordinate.x, pixelCoordinate.y + y);
        this.ctx.lineTo(pixelCoordinate.x - x, pixelCoordinate.y + y / 2);
        this.ctx.lineTo(pixelCoordinate.x - x, pixelCoordinate.y - y / 2);
        this.ctx.lineTo(pixelCoordinate.x, pixelCoordinate.y - y);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

}