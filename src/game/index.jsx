import React from "react";
import Board from "./components/board";
import { GameContainer, OuterContainer } from "./game.styled";

const Game = () => {
  return (
    <OuterContainer>
      <GameContainer>
        <Board />
      </GameContainer>
    </OuterContainer>
  );
};

export default Game;
