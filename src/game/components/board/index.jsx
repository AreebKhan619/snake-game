import React, { memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  BLOCKS_PER_COL,
  BLOCKS_PER_ROW,
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../../../assets/constants";

const DELAY_IN_MS = 500;
const NUMBERS_OF_BLOCK = BLOCKS_PER_ROW * BLOCKS_PER_COL - 1;

const Board = () => {
  const [selectedBlocks, setSelectedBlocks] = useState([54]);

  const blocksArr = useMemo(() => Array(NUMBERS_OF_BLOCK).fill(""), []);

  const addBlocks = () => {
    setSelectedBlocks((b) => [...b, 64, 74]);
  };

  useEffect(() => {
    const intId = setInterval(() => {
      setSelectedBlocks((b) => {
        const newInd = b[b.length - 1] + 10;
        if (newInd < NUMBERS_OF_BLOCK) return [...b, b[b.length - 1] + 10];
        else {
          clearInterval(intId);
          return b;
        }
      });
    }, DELAY_IN_MS);
    return () => clearInterval(intId);
  }, []);

  return (
    <div>
      <BoardOuter>
        {blocksArr.map((el, idx) => (
          <Block key={idx} selected={selectedBlocks.includes(idx)}>
            {idx}
          </Block>
        ))}
      </BoardOuter>
      <button onClick={addBlocks}>Change</button>
    </div>
  );
};

const changedSelection = (prevProps, newProps) =>
  prevProps.selected === newProps.selected;

const Block = memo(
  ({ children, ...props }) => (
    <BoardBlock {...props}>
      {children}|{Math.random().toFixed(2)}
    </BoardBlock>
  ),
  changedSelection
);

export default Board;

const BoardOuter = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const BoardBlock = styled.div`
  height: ${GAME_HEIGHT / 10 - 10}px;
  width: ${GAME_WIDTH / 10}px;
  border: 1px solid lightgrey;
  background: ${(props) => (props.selected ? "#dbafaf" : "initial")};
`;
