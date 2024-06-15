import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderComponent = ({ value, onChange, onAfterChange }) => {
    return (
      <div className="slider-container">
        <Slider
          min={100}
          max={2200}
          value={value}
          onChange={onChange}
          onAfterChange={onAfterChange}
          trackStyle={{ backgroundColor: 'green', height: 10 }}
          handleStyle={{
            borderColor: 'green',
            height: 20,
            width: 20,
            marginLeft: -10,
            marginTop: -5,
            backgroundColor: 'white',
          }}
        />
        <p>Value: {value}</p>
      </div>
    );
  };
  
  export default SliderComponent;