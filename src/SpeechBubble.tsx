import { StringLiteralLike } from "typescript";
// This TSC component is created from the svg by 1 .converting it on https://svg2jsx.com 
// 2. deleting some props that did not work  3. parameterizing the class_result and preserveAspectRatio
const SpeechBubble = ({classification_result,preserveAspectRatio}:{classification_result:string,preserveAspectRatio:string}) => {
  return <svg
      xmlns="http://www.w3.org/2000/svg"
      width="281.31"
      height="140.47"
      viewBox="0 0 74.43 37.166"
      preserveAspectRatio={preserveAspectRatio}
      x = "50"
    >
      <g
        stroke="#333"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeMiterlimit="0"
        transform="matrix(.39068 0 0 .32885 -.526 -3.869)"
      >
        <path
          fill="none"
          strokeWidth="8.1"
          d="M31.418 84.537a37.33 37.33 0 01-7.172 16.087 37.382 37.382 0 01-16.203 11.997"
        ></path>
        <path
          fill="#b3b3b3"
          strokeWidth="6.654"
          d="M5.314 114.29c8.285 1.84 16.57 3.988 24.854 5.982"
        ></path>
        <rect
          width="10.69"
          height="5.89"
          x="18.544"
          y="108.43"
          fill="#333"
          strokeWidth="8"
          rx="2.214"
          ry="2.015"
        ></rect>
        <rect
          width="6.981"
          height="6.109"
          x="23.78"
          y="101.88"
          fill="#333"
          strokeWidth="8"
          rx="2.214"
          ry="1.527"
        ></rect>
      </g>
      <rect
        width="61.182"
        height="34.299"
        x="11.814"
        y="1.434"
        fill="#b3b3b3"
        stroke="#454545"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeMiterlimit="0"
        strokeWidth="2.868"
        rx="0.865"
        ry="0.663"
      ></rect>
      <text
        x="16.324"
        y="9.515"
        style={{ whiteSpace: "pre" }}
        fill="#333"
        stroke="#454545"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeMiterlimit="0"
        strokeWidth="0"
        fontSize="3.881"
      >
        Ich glaube die Pflanze ist:
      </text>
      <text
        x="43.207"
        y="23.219"
        style={{
          lineHeight: "2",
          textAlign: "center",
          whiteSpace: "pre",
        }}
        fill="#333"
        stroke="#454545"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeMiterlimit="0"
        strokeWidth="0"
        fontSize="7.056"
        textAnchor="middle"
      >
        <tspan
          style={{textAlign: "center" }}
          fill="#d40000"
        >
          {classification_result}
        </tspan>
      </text>
    </svg>;}

export default SpeechBubble;