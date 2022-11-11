import React from "react";

const exports = {};

// Player views must be extended.
// It does not have its own Wrapper view.

exports.GetHand = class extends React.Component {
  render() {
    const { parent, playable, hands } = this.props;
    const hand = (this.state || {}).hand;
    return (
      <div>
        Enter Number of fingers
        <br />
        <input
          type="number"
          placeholder="Enter number of fingers"
          onChange={(e) => this.setState({ hand: e.currentTarget.value })}
        />{" "}
        <br />
        <button disabled={!playable} onClick={() => parent.playHand(hand)}>
          Play Hand
        </button>
      </div>
    );
  }
};
exports.GuessHand = class extends React.Component {
  render() {
    const { parent, playable, guesses } = this.props;
    const guess = (this.state || {}).guess;
    return (
      <div>
        Please Guess Total Outcome
        <br />
        <input
          type="number"
          placeholder="Enter Guess"
          onChange={(e) => this.setState({ guess: e.currentTarget.value })}
        />{" "}
        <br />
        <button disabled={!playable} onClick={() => parent.playHand(guess)}>
          Guess Hand
        </button>
      </div>
    );
  }
};

exports.WaitingForResults = class extends React.Component {
  render() {
    return <div>Waiting for results...</div>;
  }
};

exports.Total = class extends React.Component {
  render() {
    const { total } = this.props;
    console.log(`this is ${total}`);
    return (
      <div>
        <h1>Total guess was {total}</h1>
      </div>
    );
  }
};

exports.Done = class extends React.Component {
  render() {
    const { outcome, total } = this.props;
    return (
      <div>
        Total fingers player was {total}
        <br />
        Thank you for playing. The outcome of this game was:
        <br />
        {outcome || "Unknown"}
      </div>
    );
  }
};

exports.Timeout = class extends React.Component {
  render() {
    return <div>There's been a timeout. (Someone took too long.)</div>;
  }
};

export default exports;
