"use strict";
const port = 13200;

import express from 'express';
const app = express();
app.use(express.json());

import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
const mongoHost = process.env.MONGO_HOST || '127.0.0.1';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDatabase = 'cs261lab';
const connectionString = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${mongoHost}:${mongoPort}/${mongoDatabase}?authSource=admin`;
const mongoClient = new MongoClient(connectionString);
await mongoClient.connect();
const db = mongoClient.db(mongoDatabase);
const gamesCollection = db.collection('games');
console.log("Mongo Connection Successful");

import { Game } from './game.js';

app.get('/scoresLab/games/:gameName/scores', async (req, res) => {
    let query = { name: req.params.gameName };
    let gameDoc = await gamesCollection.findOne(query);
    if (gameDoc === null) {
        res.sendStatus(404);
        return;
    }
    console.log(`request to get game ${req.params.gameName}, doc is: ${JSON.stringify(gameDoc)}`);
    // send the Game object, not the document
    res.send(new Game(gameDoc));
});

app.post('/scoresLab/games/:gameName/scores/:playerName', async (req, res) => {
    let query = { name: req.params.gameName };
    let setCommand = {
        $set: {
            [`scores.${req.params.playerName}`]: req.body.score
        }
    };
    let setOptions = { upsert: true, returnDocument: 'after' };
    let gameDoc = await gamesCollection.findOneAndUpdate(query, setCommand, setOptions);
    console.log(`add player ${req.params.playerName} score to ${req.params.gameName}, doc is ${JSON.stringify(gameDoc)}`);
    // send Game, not gameDoc
    res.send(new Game(gameDoc));
});

// new!
app.get(`/scoresLab/games-by-id/:gameId`, async (req, res) => {
    res.sendStatus(404);
});

// new!
app.post(`/scoreslab/games-by-id/:gameId/player/:playerName`, async (req, res) => {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
