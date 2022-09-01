import { Container, Grid } from "@mantine/core";
import { ReactComponent as RobotIcon } from "../RobotIcon.svg";
import SpeechBubble from "../SpeechBubble";
import "./RobotWrapper.css";
const RobotWrapper = ({ message }: { message: JSX.Element }) => {
  return (
    <div className="RobotWrapper">      
        <RobotIcon className="RobotIcon" style={{}} />
        <div className="RobotMessage bubble">
          <p>{message}</p>
        </div>
    </div>
  );
};

export default RobotWrapper;
