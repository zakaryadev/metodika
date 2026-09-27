"use client";

import type { Game } from "@/content/games";
import {
  FillBlankGame,
  FindErrorGame,
  FlashcardsGame,
  QuizGame,
  TrueFalseGame,
} from "./Basic";
import {
  AnagramGame,
  CategorizeGame,
  MatchGame,
  MemoryGame,
  OrderingGame,
} from "./Matching";
import { CrosswordGame, HangmanGame, WordSearchGame } from "./Grid";
import { ScenarioGame, SpeedGame, WheelGame } from "./Timed";

/**
 * Ўйин двигатели. Фақат мижозда юкланади (`ssr: false`), шунинг учун
 * ҳар бир ўйин ўз ҳолатини бевосита useState ичида тасодифий
 * аралаштириб бошлаши мумкин — гидратация муаммоси юзага келмайди.
 */
export default function Engine({ game }: { game: Game }) {
  switch (game.kind) {
    case "quiz":
      return <QuizGame data={game.data} />;
    case "truefalse":
      return <TrueFalseGame data={game.data} />;
    case "fillblank":
      return <FillBlankGame data={game.data} />;
    case "finderror":
      return <FindErrorGame data={game.data} />;
    case "flashcards":
      return <FlashcardsGame data={game.data} />;
    case "memory":
      return <MemoryGame data={game.data} />;
    case "match":
      return <MatchGame data={game.data} />;
    case "categorize":
      return <CategorizeGame data={game.data} />;
    case "ordering":
      return <OrderingGame data={game.data} />;
    case "anagram":
      return <AnagramGame data={game.data} />;
    case "wordsearch":
      return <WordSearchGame data={game.data} />;
    case "crossword":
      return <CrosswordGame data={game.data} />;
    case "hangman":
      return <HangmanGame data={game.data} />;
    case "speed":
      return <SpeedGame data={game.data} />;
    case "wheel":
      return <WheelGame data={game.data} />;
    case "scenario":
      return <ScenarioGame data={game.data} />;
  }
}
