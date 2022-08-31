import { Container, Grid } from "@mantine/core";
import { ReactComponent as RobotIcon } from "../RobotIcon.svg";
import SpeechBubble from "../SpeechBubble";
import "./RobotWrapper.css";
const RobotWrapper = ({ class_result }: { class_result: string }) => {
  return (
    <div className="RobotWrapper">      
        <RobotIcon className="RobotIcon" style={{}} />
        <div className="RobotMessage bubble">
          <p>{class_result}</p>
        </div>
    </div>
  );
};

export default RobotWrapper;
