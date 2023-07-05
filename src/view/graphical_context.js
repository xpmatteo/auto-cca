"use strict";

import { IMAGES } from "./load_all_images.js";
import { Point } from "../lib/hexlib.js";


export class GraphicalContext {
    constructor(ctx) {
        this.ctx = ctx;
    }

    drawEllipse(pixel, width, height, color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.ellipse(pixel.x, pixel.y, width, height, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
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

    writeText(text, pixelCoordinate, font="12pt Arial", color='black') {
        this.ctx.save();
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, pixelCoordinate.x, pixelCoordinate.y);        
        this.ctx.restore();
    }

    drawImage(url, pixelCoordinate) {
        let img = IMAGES[url];
        if (!img) {
            throw new Error(`Image ${url} not found`);
        }
        this.ctx.drawImage(img, pixelCoordinate.x, pixelCoordinate.y, img.width, img.height);
        return new Point(img.width, img.height);
    }    

    drawImageCentered(url, pixelCoordinate) {
        let img = IMAGES[url];
        if (!img) {
            throw new Error(`Image ${url} not found`);
        }
        this.ctx.drawImage(img, pixelCoordinate.x - img.width / 2, pixelCoordinate.y - img.height / 2, img.width, img.height);
        return new Point(img.width, img.height);
    }    

    drawRect(pixelCoordinate, width, height, lineWidth, color) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(pixelCoordinate.x, pixelCoordinate.y, width, height);
        this.ctx.restore();
    }

    fillRect(pixelCoordinate, width, height, color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(pixelCoordinate.x, pixelCoordinate.y, width, height);
        this.ctx.restore();
    }

    drawCross(pixelCoordinate, lineWidth, color) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        const length = 20;
        this.ctx.moveTo(pixelCoordinate.x - length, pixelCoordinate.y - length);
        this.ctx.lineTo(pixelCoordinate.x + length, pixelCoordinate.y + length);
        this.ctx.moveTo(pixelCoordinate.x + length, pixelCoordinate.y - length);
        this.ctx.lineTo(pixelCoordinate.x - length, pixelCoordinate.y + length);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

}