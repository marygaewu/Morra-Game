"reach 0.1";

const [isOutcome, PLAYERTwo_WINS, PLAYEROne_WINS, DRAW] = makeEnum(3);
// const total;
const winner = (
  playerOneHand,
  playerTwoHand,
  PlayerOneGuess,
  PlayerTwoGuess
) => {
  if (PlayerOneGuess == PlayerTwoGuess) return DRAW;
  else if (PlayerOneGuess == playerOneHand + playerTwoHand)
    return PLAYEROne_WINS;
  else if (PlayerTwoGuess == playerOneHand + playerTwoHand)
    return PLAYERTwo_WINS;
  else {
    return DRAW;
  }
};
export const main = Reach.App(() => {
  const Players = {
    ...hasRandom,
    getHand: Fun([], UInt),
    guessOutcome: Fun([], UInt),
    seeOutcome: Fun([UInt], Null),
    Total: Fun([UInt], Null),
  };

  const PlayerOne = Participant("PlayerOne", {
    ...Players,
    wager: UInt,
  });
  const PlayerTwo = Participant("PlayerTwo", {
    ...Players,
    acceptWager: Fun([UInt], Null),
  });
  init();
  // The first one to publish deploys the contract
  PlayerOne.only(() => {
    const wager = declassify(interact.wager);
  });
  PlayerOne.publish(wager).pay(wager);
  commit();
  // The second one to publish always attaches

  PlayerTwo.only(() => {
    interact.acceptWager(wager);
  });
  PlayerTwo.pay(wager);
  // commit();

  var outcome = DRAW;
  invariant(balance() == 2 * wager && isOutcome(outcome));
  while (outcome == DRAW) {
    //loop
    commit();
    PlayerOne.only(() => {
      const playerOneHand = declassify(interact.getHand());
      const _PlayerOneGuess = interact.guessOutcome();
      const [_commitPlayerOne, _saltPlayerOne] = makeCommitment(
        interact,
        _PlayerOneGuess
      );
      const commitPlayerOne = declassify(_commitPlayerOne);
    });
    PlayerOne.publish(playerOneHand, commitPlayerOne);
    commit();

    unknowable(PlayerTwo, PlayerOne(_PlayerOneGuess, _saltPlayerOne));
    PlayerTwo.only(() => {
      const playerTwoHand = declassify(interact.getHand());
      const PlayerTwoGuess = declassify(interact.guessOutcome());
    });
    PlayerTwo.publish(playerTwoHand, PlayerTwoGuess);
    commit();
    const total = playerOneHand + playerTwoHand;
    PlayerOne.only(() => {
      const PlayerOneGuess = declassify(_PlayerOneGuess);
      const saltPlayerOne = declassify(_saltPlayerOne);
    });

    PlayerOne.publish(PlayerOneGuess, saltPlayerOne);
    checkCommitment(commitPlayerOne, saltPlayerOne, PlayerOneGuess);

    each([PlayerOne, PlayerTwo], () => {
      //const total = 2;
      interact.Total(total);
    });

    outcome = winner(
      playerOneHand,
      playerTwoHand,
      PlayerOneGuess,
      PlayerTwoGuess
    );

    continue;
  }

  //const outcome = PLAYEROne_WINS ? PlayerOne : PlayerTwo;

  // const who = A;

  transfer(2 * wager).to(outcome == PLAYEROne_WINS ? PlayerOne : PlayerTwo);
  commit();
  // write your program here

  each([PlayerOne, PlayerTwo], () => {
    // interact.Total(total);
    interact.seeOutcome(outcome);
  });
  exit();
});
