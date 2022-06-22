import { ReactComponent as RobotIcon } from "../RobotIcon.svg";
import SpeechBubble from "../SpeechBubble";
const RobotWrapper = ({ class_result }: { class_result: string }) => {
  return (
    <div style={{ overflow: "auto", maxHeight: "30vh" }}>
      {/* <svg style={{margin:"auto", height:"100%", width:"100%"}}> */}
      <RobotIcon
        preserveAspectRatio={"xMinYMax meet"}
        style={{ maxHeight: "70%", float:"left" }}
      />{" "}
      {/* inner svg has preserved ratio and is sticked to left-bottom */}
      <div style={{ maxHeight: "70%", float:"right"}}>
        <SpeechBubble
          classification_result={class_result}
          preserveAspectRatio={"xMaxYMin meet"}
        />
        {/* TODO Somehow the xMaxYmin does not work, solved by float prop*/}
      </div>
      {/* </svg> */}
    </div>
  );
};

export default RobotWrapper;
