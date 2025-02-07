"use strict";
export class Game {
    constructor(gameDoc) {
        this.id = gameDoc._id.toString();
        this.name = gameDoc.name;
        this.scores = gameDoc.scores;
    }
}