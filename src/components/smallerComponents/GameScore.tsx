import { Center, Title } from "@mantine/core";

const GameScore = ({
  gameScore,
  maxGameScore,
}: {
  gameScore: number;
  maxGameScore: number;
}) => (
  <Center>
    <Title order={2}>
      Score: {gameScore}/{maxGameScore}
    </Title>
  </Center>
);

export default GameScore;
