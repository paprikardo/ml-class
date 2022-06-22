
const preprocessPoints = (points: [number,number,string | number][]): [[number, number][],[number, number][],number,number,number,number] => {
  const kerbel = []
  const brennessel = []
  var xmax = points[0][0]
  var xmin = points[0][0]
  var ymax = points[0][1]
  var ymin = points[0][1]
  for (let i = 0; i < points.length; i++) {
    if(points[i][0] > xmax){
      xmax = points[i][0]
    }
    if(points[i][0] < xmin){
      xmin = points[i][0]
    }
    if(points[i][1] > ymax){
      ymax = points[i][1]
    }
    if(points[i][1] < ymin){
      ymin = points[i][1]
    }
    if(points[i][2] == 'Kerbel'){
      kerbel.push(points[i].slice(0,2))
    }
    else{
      brennessel.push(points[i].slice(0,2))
    }
  }
  return [kerbel, brennessel,xmax,xmin,ymax,ymin] as [[number, number][],[number, number][],number,number,number,number];
}

export const computeLine = (points:[number,number,string|number][]): [number, number][] => {
  const [kerbel,brennessel, xmax, xmin,ymax,ymin] = preprocessPoints(points);
  const mK :[number,number] = mean(kerbel);
  const mB :[number,number] = mean(brennessel);
  const mK_minus_mB : [number,number] = [mK[0]-mB[0],mK[1]-mB[1]];
  const co_inv = mmul(madd(inv(cov(kerbel)),inv(cov(brennessel))),0.5)
  const z = mv(inv(co_inv),mK_minus_mB)
  const w = vm(mK_minus_mB,co_inv)
  const y_axis = (vv(mK,mv(co_inv,mK)) - vv(mB,mv(co_inv,mB)))/(z[1]+w[1])
  console.log("points: ",points)
  console.log("mK: ",mK)
  console.log("mB: ",mB)
  console.log("co_inv: ",co_inv)
  console.log("z: ",z)
  console.log("w: ",w)
  console.log("y_axis: ",y_axis)
  const xses = [xmin,xmin+(xmax-xmin)/2,xmax]
  var result:[number,number][] = []
  for (let i = 0; i < xses.length; i++){
    const x = xses[i]
    const y = -(x*z[0]+x*w[0])/(z[1]+w[1]) + y_axis
    result[i] = [x,y]
  }
  return result;
};

const mean = (points:[number,number][]):[number,number]=> {
  var mean: [number,number] = [0,0];
  for (let i = 0; i < points.length; i++) {
    mean[0] += points[i][0];
    mean[1] += points[i][1];
  }
  mean[0] /= points.length
  mean[1] /= points.length
  return mean;
}

const cov = (points:[number,number][]):[[number,number],[number,number]] => {
  // E((X_i - E(X_i)) * (Y_i - E(Y_i)))
  // sum (xi[0]-mean[0]) * (xi[1]-mean[1]) /n
  const [m0,m1] = mean(points);
  var r00 = 0
  var r10 = 0
  var r11 = 0
  for (let i = 0; i < points.length; i++) {
    r00 += (points[i][0]-m0)**2
    r10 += (points[i][0]-m0) * (points[i][1]-m1)
    r11 += (points[i][1]-m1)**2
  }
  r00 /= points.length
  r10 /= points.length
  r11 /= points.length
  return [[r00,r10],[r10,r11]]
}

const inv = (points:[[number,number],[number,number]]):[[number,number],[number,number]] => {
  var [[a,b],[c,d]] = points
  const div_by = a*d-b*c
  a /= div_by
  b /= div_by
  c /= div_by
  d /= div_by
  return [[d,-b],[-c,a]]
}

const mv = (m:[[number,number],[number,number]],v:[number,number]) : [number,number] => {
  const [[a,b],[c,d]] = m
  const [e,f] = v
  return [a*e+b*f,c*e+d*f]
}

const vm = (v:[number,number],m:[[number,number],[number,number]]) : [number,number] => {
  const [[a,b],[c,d]] = m
  const [e,f] = v
  return [e*a+f*c,e*b+f*d]
}

const vv = (v:[number,number], v2:[number,number]) : number => {
  const [a,b] = v
  const [c,d] = v2
  return a*c+b*d
}

const madd = (m:[[number,number],[number,number]], m2:[[number,number],[number,number]]) : [[number,number],[number,number]]=> {
  const [[a,b],[c,d]] = m
  const [[e,f],[g,h]] = m2
  return [[a+e,b+f],[c+g,d+h]]
}

const mmul = (m:[[number,number],[number,number]], x:number) : [[number,number],[number,number]] => {
  const [[a,b],[c,d]] = m
  return [[a*x,b*x],[c*x,d*x]]
}