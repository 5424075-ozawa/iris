import { useState } from "react";
import irisData from "./data/iris.json";
import "./App.css";

const properties = [
  { key: "sepalLength", label: "sepal length", min: 4, max: 8, step: 0.5 },
  { key: "sepalWidth", label: "sepal width", min: 2, max: 4.4, step: 0.2 },
  { key: "petalLength", label: "petal length", min: 1, max: 7, step: 1 },
  { key: "petalWidth", label: "petal width", min: 0, max: 2.5, step: 0.5 },
];

const speciesColors = {
  setosa: "green",
  versicolor: "purple",
  virginica: "orange",
};

const App = () => {
  const [xProperty, setXProperty] = useState("sepalLength");
  const [yProperty, setYProperty] = useState("sepalWidth");

  const [visibleSpecies, setVisibleSpecies] = useState({
    setosa: true,
    versicolor: true,
    virginica: true,
  });

  const width = 820;
  const height = 560;

  const margin = {
    top: 40,
    right: 170,
    bottom: 60,
    left: 55,
  };

  const xInfo = properties.find((property) => property.key === xProperty);
  const yInfo = properties.find((property) => property.key === yProperty);

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const scaleX = (value) => {
    return (
      margin.left +
      ((value - xInfo.min) / (xInfo.max - xInfo.min)) * plotWidth
    );
  };

  const scaleY = (value) => {
    return (
      height -
      margin.bottom -
      ((value - yInfo.min) / (yInfo.max - yInfo.min)) * plotHeight
    );
  };

  const makeTicks = (min, max, step) => {
    const ticks = [];

    for (let value = min; value <= max + 0.001; value += step) {
      ticks.push(Number(value.toFixed(1)));
    }

    return ticks;
  };

  const xTicks = makeTicks(xInfo.min, xInfo.max, xInfo.step);
  const yTicks = makeTicks(yInfo.min, yInfo.max, yInfo.step);

  const toggleSpecies = (species) => {
    setVisibleSpecies({
      ...visibleSpecies,
      [species]: !visibleSpecies[species],
    });
  };

  return (
    <div>
      <header className="header">
        <h1>scatter plot of iris data</h1>
      </header>

      <div className="controls">
        <label>
          <span>x property</span>
          <select
            value={xProperty}
            onChange={(event) => setXProperty(event.target.value)}
          >
            {properties.map((property) => (
              <option key={property.key} value={property.key}>
                {property.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>y property</span>
          <select
            value={yProperty}
            onChange={(event) => setYProperty(event.target.value)}
          >
            {properties.map((property) => (
              <option key={property.key} value={property.key}>
                {property.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <svg width={width} height={height}>
        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="gray"
        />

        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          stroke="gray"
        />

        {xTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={scaleX(tick)}
              y1={height - margin.bottom}
              x2={scaleX(tick)}
              y2={height - margin.bottom + 10}
              stroke="gray"
            />
            <text
              x={scaleX(tick)}
              y={height - margin.bottom + 30}
              textAnchor="middle"
            >
              {tick}
            </text>
          </g>
        ))}

        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={margin.left - 10}
              y1={scaleY(tick)}
              x2={margin.left}
              y2={scaleY(tick)}
              stroke="gray"
            />
            <text
              x={margin.left - 14}
              y={scaleY(tick) + 6}
              textAnchor="end"
            >
              {tick}
            </text>
          </g>
        ))}

        {irisData.map((item, i) => (
          <circle
            key={i}
            className="point"
            cx={scaleX(item[xProperty])}
            cy={scaleY(item[yProperty])}
            r={7}
            fill={speciesColors[item.species]}
            opacity={visibleSpecies[item.species] ? 0.8 : 0}
          />
        ))}

        <g className="legend" transform={`translate(${width - 135}, 65)`}>
          {Object.keys(speciesColors).map((species, i) => (
            <g
              key={species}
              transform={`translate(0, ${i * 40})`}
              onClick={() => toggleSpecies(species)}
            >
              <rect
                width={22}
                height={22}
                fill={speciesColors[species]}
                opacity={visibleSpecies[species] ? 0.8 : 0.25}
              />
              <text
                x={32}
                y={18}
                opacity={visibleSpecies[species] ? 1 : 0.35}
              >
                {species}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default App;