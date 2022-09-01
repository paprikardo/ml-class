import { useEffect, useState } from "react";
import Layout2DUserLine from "../components/Layout2DUserLine";
import {
  dummy2C3D,
  dummy2C2D,
  IData,
  IDataPoint,
  weizen2Dataset1D,
} from "../Data";
import InitModal from "../components/InitModal";
import { rand_0_10 } from "../Random";

export default ({
  currentData,
  setDataSinglePoint,
  setSelectedAttrib,
  addRandomPoint,
  initModalTitle,
  initModalContent,
  setCurrentData,
  dimensions,
}: {
  currentData: IData;
  setDataSinglePoint: (means: IDataPoint[]) => void;
  setSelectedAttrib: (xAxisAttrib: number, yAxisAttrib?: number) => void;
  addRandomPoint: (means: IDataPoint[], variance?: number) => void;
  initModalTitle: string;
  initModalContent: string;
  setCurrentData: React.Dispatch<React.SetStateAction<IData>>;
  dimensions: number;
}): JSX.Element => {
  const dataset = dimensions == 2 ? dummy2C2D : dummy2C3D;
  const numClasses = dataset.data.length;

  const newMeans = (): IDataPoint[] => {
    const minMeanDistance = 5;
    const means: IDataPoint[] = [];
    for (var c = 0; c < numClasses; c++) {
      var classMean: IDataPoint = [];
      while (
        classMean.length == 0 ||
        means
          .map(
            (
              otherClassMean //map to array of distances to mean
            ) =>
              classMean
                .map((x, i) => Math.abs(x - otherClassMean[i]))
                .reduce((partialSum, a) => partialSum + a, 0)
          )
          .some((x) => x < minMeanDistance) //resample if some distance is smaller than minMeanDistance
      ) {
        classMean = [];
        for (var i = 0; i < dimensions; i++) {
          classMean.push(rand_0_10());
        }
      }
      means.push(classMean);
    }
    return means;
  };
  console.log(newMeans());
  const [classMeans, setClassMeans] = useState(newMeans());
  //initialize dataset to single point
  useEffect(() => {
    setCurrentData(dataset);
    setDataSinglePoint(classMeans);
    //sample new Means and generate new first points if they are too close to each other
    const p0 = currentData.data[0].points[0];
    const p1 = currentData.data[1].points[0];
    const minLengthForUserline = 3;
    console.log(Math.abs(p0[0] - p1[0]) + Math.abs(p0[1] - p1[1]));
    if (
      Math.abs(p0[0] - p1[0]) + Math.abs(p0[1] - p1[1]) <=
      minLengthForUserline
    ) {
      console.log("loop");
      setClassMeans(newMeans());
      setDataSinglePoint(classMeans);
    }
  }, []);
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      <Layout2DUserLine
        currentData={currentData}
        setDataSinglePoint={setDataSinglePoint}
        onNextGameRound={() => addRandomPoint(classMeans)}
        setSelectedAttrib={setSelectedAttrib}
      ></Layout2DUserLine>
    </div>
  );
};
