import InitModal from "../components/InitModal";
import Layout2DRobotLine from "../components/Layout2DRobotLine";
import { dummy2C2D, dummy2C3D, IData, IDataPoint } from "../Data";
import { useEffect } from "react";
import { newMeans } from "../Others/newMeans";
export default ({
  currentData,
  setDataSinglePoint,
  changeNewPoint,
  addPoint,
  setSelectedAttrib,
  setCurrentData,
  initModalTitle,
  initModalContent,
  dimensions,
}: {
  currentData: IData;
  setDataSinglePoint: (means: IDataPoint[]) => void;
  changeNewPoint: (new_point: IDataPoint) => void;
  addPoint: (cl: number, new_point: IDataPoint) => void;
  setSelectedAttrib: (xAxisAttrib: number, yAxisAttrib?: number) => void;
  initModalTitle: string;
  initModalContent: string;
  setCurrentData: React.Dispatch<React.SetStateAction<IData>>;
  dimensions: number;
}) => {
  const dataset = dimensions == 2 ? dummy2C2D : dummy2C3D;
  const numClasses = dataset.data.length;
  useEffect(() => {
    setCurrentData(dataset);
    setDataSinglePoint(newMeans(numClasses,dimensions));
  }, []);
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      <Layout2DRobotLine
        currentData={currentData}
        changeNewPoint={changeNewPoint}
        addPoint={addPoint}
        setSelectedAttrib={setSelectedAttrib}
      ></Layout2DRobotLine>
    </div>
  );
};
