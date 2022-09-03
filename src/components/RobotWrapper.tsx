import { Container, Grid } from "@mantine/core";
import { ReactComponent as RobotIcon } from "../RobotIcon.svg";
import SpeechBubble from "../SpeechBubble";
import "./RobotWrapper.css";
const RobotWrapper = ({ message }: { message: JSX.Element }) => {
  return (
    <div className="RobotWrapper">      
        <RobotIcon className="RobotIcon"/>
        <div className="RobotMessage bubble">
          {message}
        </div>
    </div>
  );
};

export default RobotWrapper;
