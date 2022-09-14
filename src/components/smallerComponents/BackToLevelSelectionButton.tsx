import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

const BackToLevelSelectionButton = () => (
  <Link to="/ml-class/level-selection">
    <Button>Zurück zur Level-Auswahl</Button>
  </Link>
);

export default BackToLevelSelectionButton;
