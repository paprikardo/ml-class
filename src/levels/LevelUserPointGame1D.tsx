//mostly copied from LevelUserLineGame2D
import { useEffect, useState } from "react";
import Layout1DUserLine from "../components/Layout1DUserLine";
import {
  dummy2C3D1A,
  dummy2C2D1A
} from "../Data";
import InitModal from "../components/InitModal";
import { rand_0_10 } from "../Others/Random";
import { newMeans } from "../Others/newMeans";
import { addRandomPoint, setCurrentDataType, setDataSinglePoint } from "../Others/currentDataHelperMethods";

export default ({
  dimensions,
  initModalTitle,
  initModalContent,
}: {
  dimensions: number; //dimensions of the points displayed in this 1D game level
  initModalTitle: string;
  initModalContent: string;
}): JSX.Element => {
  const dataset = dimensions == 2 ? dummy2C2D1A : dummy2C3D1A;
  const numClasses = dataset.data.length;
  const [currentData,setCurrentData] = useState(dataset)
  const [classMeans, setClassMeans] = useState(
    newMeans(numClasses, dimensions)
  );
  //initialize dataset to single point
  useEffect(() => {
    setDataSinglePoint(setCurrentData,classMeans);
    //sample new Means and generate new first points if they are too close to each other
    const p0 = currentData.data[0].points[0];
    const p1 = currentData.data[1].points[0];
    const minLengthForUserline = 3;
    if (
      //resample points if they are to close to each other
      Math.abs(p0[0] - p1[0]) <= minLengthForUserline
    ) {
      setClassMeans(newMeans(numClasses, dimensions));
      setDataSinglePoint(setCurrentData,classMeans);
    }
  }, []);
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      <Layout1DUserLine
        currentData={currentData}
        setCurrentData={setCurrentData}
        onNextGameRound={() => addRandomPoint(setCurrentData,classMeans)}
      ></Layout1DUserLine>
    </div>
  );
};
