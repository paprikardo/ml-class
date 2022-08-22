import { ReactComponent as RobotIcon } from "../RobotIcon.svg";
import SpeechBubble from "../SpeechBubble";
import "./RobotWrapper.css";
const RobotWrapper = ({ class_result }: { class_result: string }) => {
  return (
    <div className="RobotWrapper">
      <div className="RobotMessage bubble">
        <p>{class_result}</p>
      </div>
      <RobotIcon
        className="RobotIcon"
        preserveAspectRatio={"xMinYMax meet"}
      />{" "}
      {/* inner svg has preserved ratio and is sticked to left-bottom */}
      {/* <div style={{ maxHeight: "70%", float:"right"}}>
        <SpeechBubble
          classification_result={class_result}
          preserveAspectRatio={"xMaxYMin meet"}
        />
        {/* TODO Somehow the xMaxYmin does not work, solved by float prop
      </div> */}
      {/* </svg> */}
    </div>
  );
};

export default RobotWrapper;
