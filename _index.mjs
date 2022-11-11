import { loadStdlib } from "@reach-sh/stdlib";
import * as backend from "./build/index.main.mjs";
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);
const OUTCOME = ["PLAYERTWO_WINS", "PLAYERONE_WINS", "DRAW"];

const [accPlayerOne, accPlayerTwo] = await stdlib.newTestAccounts(
  2,
  startingBalance
);
const format = (x) => stdlib.formatCurrency(x, 4);

console.log("**********Morra**********");
console.log("Hello, Welcome!");

console.log("Launching...");
const ctcPlayerOne = accPlayerOne.contract(backend);
const ctcPlayerTwo = accPlayerTwo.contract(backend, ctcPlayerOne.getInfo());
const getBalance = async (who) => format(await stdlib.balanceOf(who));
const beforePlayerOne = await getBalance(accPlayerOne);
const beforePlayerTwo = await getBalance(accPlayerTwo);
const Players = (who) => ({
  playHand: () => {
    const hand = Math.floor(Math.random() * 5);
    console.log(`${who} played ${hand}`);
    return hand;
  },
  guessOutcome: () => {
    const guess = Math.floor(Math.random() * 10);
    console.log(`${who} guessed ${guess}`);
    return guess;
  },
  seeOutcome: (outcome) => {
    console.log(`${who} saw ${OUTCOME[outcome]}`);
  },
  Total: async (total) => {
    console.log(`Total fingers played was ${total}`);
  },
});
console.log("Loading...");
await Promise.all([
  backend.PlayerOne(ctcPlayerOne, {
    ...stdlib.hasRandom,
    ...Players("PlayerOne"),
    wager: stdlib.parseCurrency(5),
  }),
  backend.PlayerTwo(ctcPlayerTwo, {
    ...stdlib.hasRandom,
    acceptWager: async (wage) => {
      console.log(`PlayerTwo accepts wager of ${format(wage)}`);
    },
    ...Players("PlayerTwo"),
  }),
]);
const afterPlayerOne = await getBalance(accPlayerOne);
const afterPlayerTwo = await getBalance(accPlayerTwo);

console.log(`PlayerOne went from ${beforePlayerOne} to ${afterPlayerOne}`);
console.log(`PlayerTwo went from ${beforePlayerTwo} to ${afterPlayerTwo}`);
