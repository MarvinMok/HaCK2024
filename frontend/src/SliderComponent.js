// import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderComponent = ({ value, onChange, onAfterChange }) => {
    return (
      <div className="slider-container">
        <Slider
          min={600}
          max={1800}
          value={value}
          onChange={onChange}
          onAfterChange={onAfterChange}
          style={{width: `80%`, margin: `0 auto`}}
        />
        <p>Value: {value}</p>
      </div>
    );
  };
  
  export default SliderComponent;