import React from "react";

const outputTemp = (temp) => (temp !== "" ? `${temp} °C` : "loading...");

// {
//   if (type === "user") {
//     return userTemp !== "" ? `${userTemp} °C` : "loading...";
//   } else if (type === "city") {
//     return cityTemp !== "" ? `${cityTemp} °C` : "loading...";
//   }
// };

const OutputTempDiff = ({ colder, diff }) => {
  const diffSymbol = colder ? "-" : "+";
  const spanColor = colder ? "blue" : "tomato";
  return (
    <span style={{ marginLeft: 10, color: spanColor, fontWeight: "bold" }}>
      {`   (${diffSymbol}${diff} °C)`}
    </span>
  );
};
// const outputTempDiff = (tempDifference) => (
//   <span style={{ fontWeight: "bold" }}>
//     {tempDifference !== "" ? `(${tempDifference} °C` : "loading..."}
//   </span>
// );

export { outputTemp, OutputTempDiff };
