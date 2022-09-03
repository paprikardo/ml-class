import InitModal from "../components/InitModal";
import Layout2DRobotLine from "../components/Layout2DRobotLine";
import { dummy2C2D, dummy2C3D, IData, IDataPoint } from "../Data";
import { useEffect, useState } from "react";
import { newMeans } from "../Others/newMeans";
import { setDataSinglePoint } from "../Others/currentDataHelperMethods";
export default ({
  initModalTitle,
  initModalContent,
  dimensions,
}: {
  initModalTitle: string;
  initModalContent: string;
  dimensions: number;
}) => {
  const dataset = dimensions == 2 ? dummy2C2D : dummy2C3D;
  const numClasses = dataset.data.length;
  const [currentData, setCurrentData] = useState(dataset);
  useEffect(() => {
    setDataSinglePoint(setCurrentData, newMeans(numClasses, dimensions));
  }, []);
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      <Layout2DRobotLine
        currentData={currentData}
        setCurrentData={setCurrentData}
      ></Layout2DRobotLine>
    </div>
  );
};
