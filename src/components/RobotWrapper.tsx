import { ReactComponent as RobotIcon } from "../svg/RobotIcon.svg";
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
