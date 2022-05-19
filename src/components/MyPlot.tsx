import {IData} from "../Data"
const boxmargin = 20 //border in percent
const scaleX = (x:number,xmin:number,xmax:number):string  => {  
  const len_intervall = xmax-xmin
  const percent = (x-xmin)/len_intervall
  console.log("mapped ", x," to ", percent)
  // 100*x+b = 100-b
  // 100*x = 100-2b
  // x = 1-2b/100
  return (((percent*100)*(1-2*boxmargin/100))+boxmargin)+"%"
}
const scaleY = (y:number,ymin:number,ymax:number):string => {
  const len_intervall = ymax-ymin
  const percent = (y-ymin)/len_intervall
  console.log("mapped ", y," to ", percent)
  return (((percent*100)*(1-2*boxmargin/100))+boxmargin)+"%"
}

const myPlot = ({ plot_data }: { plot_data: IData }) =>{
  const class1 = plot_data.data[0]
  const class2 = plot_data.data[1]
  const all_data_x = [...class1.data.map( ({x,y},index) => x),...class2.data.map( ({x,y},index) => x)]
  const all_data_y = [...class1.data.map( ({x,y},index) => y),...class2.data.map( ({x,y},index) => y)]
  const xmin = Math.min(...all_data_x)
  const xmax = Math.max(...all_data_x)
  const ymin = Math.min(...all_data_y)
  const ymax = Math.max(...all_data_y)
  const points1 = class1.data.map(({x,y},index) => <circle key={"c1"+index} cx={scaleX(x,xmin,xmax)} cy={scaleY(y,ymin,ymax)} r="10" stroke="black" strokeWidth="3" fill="red" />)
  const points2 = class2.data.map(({x,y},index) => <circle key={"c2"+index} cx={scaleX(x,xmin,xmax)} cy={scaleY(y,ymin,ymax)} r="10" stroke="black" strokeWidth="3" fill="red" />)
  return <svg height="100%" width="100%">
    {points1}
    {points2}
  </svg>
}

export default myPlot