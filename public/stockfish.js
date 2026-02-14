// Stockfish Web Worker wrapper
// This file will load stockfish from CDN
importScripts('https://cdn.jsdelivr.net/npm/stockfish@16.0.0/src/stockfish.js');

let stockfish = null;

self.onmessage = function(e) {
  const command = e.data;
  
  if (!stockfish) {
    stockfish = STOCKFISH();
    stockfish.onmessage = function(msg) {
      self.postMessage(msg);
    };
  }
  
  stockfish.postMessage(command);
};
