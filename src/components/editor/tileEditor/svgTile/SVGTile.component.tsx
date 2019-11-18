import React, { useContext } from "react";
import ReactSVG from "react-svg";
import GeneralContext from "../../../../context/global/general.context";

const path = "tile";
const getSVGAsset = (name: string, family: string, type: string) =>
  `../assets/${type}/${family}/${name}.svg`;
// ''../assets/Tile/Contemporary/c66.png

const SVGTile: React.FC = () => {
  const { selectedColor } = useContext(GeneralContext);
  return (
    <ReactSVG
      src={getSVGAsset("tile", "Contemporary", "Tile")}
      afterInjection={(error, svg) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(svg);
      }}
      beforeInjection={svg => {
        svg.classList.add("svg-class-name");
        svg.setAttribute("style", "width: 250px; height: 250px");
        svg.addEventListener("click", (e: Event) => {
          const targetClass = (e.target as Element).getAttribute("class");
          const layer = Array.from(svg.childNodes)
            .reduce(
              (acc: any, curr) =>
                curr.childNodes.length > 0
                  ? [...acc, curr, ...Array.from(curr.childNodes)]
                  : [...acc, curr],
              []
            )
            .filter(
              (node: any) =>
                node["attributes"] &&
                node["attributes"]["class"] &&
                node["attributes"]["class"]["nodeValue"] === targetClass
            );
          layer.forEach((e: any) => e.setAttribute("fill", selectedColor));
        });
      }}
      fallback={() => <span>Error!</span>}
      loading={() => <span>Loading</span>}
      renumerateIRIElements={false}
      wrapper="span"
      className="wrapper-class-name"
      onClick={event => {
        console.log("wrapper onClick");
      }}
    />
  );
};
export default SVGTile;

const colorSVG = (svg: Element) => (e: Event) => {
  const targetClass = (e.target as Element).getAttribute("class");
  const layer = Array.from(svg.childNodes)
    .reduce(
      (acc: any, curr) =>
        curr.childNodes.length > 0
          ? [...acc, curr, ...Array.from(curr.childNodes)]
          : [...acc, curr],
      []
    )
    .filter(
      (node: any) =>
        node["attributes"] &&
        node["attributes"]["class"] &&
        node["attributes"]["class"]["nodeValue"] === targetClass
    );
  layer.forEach((e: any) => e.setAttribute("fill", "white"));
};
