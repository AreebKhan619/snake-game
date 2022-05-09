import styled from "styled-components";
import { GAME_WIDTH, GAME_HEIGHT } from "../assets/constants";

export const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const GameContainer = styled.div`
  height: ${GAME_HEIGHT}px;
  width: ${GAME_WIDTH}px;
  box-shadow: 0 0 4px black;
`;
