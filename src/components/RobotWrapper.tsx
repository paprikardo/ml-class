import { Container, Grid } from "@mantine/core";
import { ReactComponent as RobotIcon } from "../RobotIcon.svg";
import SpeechBubble from "../SpeechBubble";
import "./RobotWrapper.css";
const RobotWrapper = ({
  message,
  notSticky,
}: {
  message: JSX.Element;
  notSticky?: boolean;
}) => {
  return (
    <div
      className={notSticky ? "RobotWrapper" : "RobotWrapper StickyBottomLeft"}
    >
      <RobotIcon className="RobotIcon" />
      <div className="RobotMessage bubble">{message}</div>
    </div>
  );
};

export default RobotWrapper;
