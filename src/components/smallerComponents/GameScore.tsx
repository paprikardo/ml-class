import { Center, Title } from "@mantine/core";
export default ({
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
