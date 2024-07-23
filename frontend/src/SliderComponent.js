// import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderComponent = ({ min, max, value, onChange, onAfterChange }) => {
    return (
      <div className="slider-container">
        <Slider
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          // onAfterChange={onAfterChange}
          style={{width: `80%`, margin: `0 auto`}}
        />
        <p>Value: {value}</p>
      </div>
    );
  };
  
  export default SliderComponent;