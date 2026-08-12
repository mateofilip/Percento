import React from "react";

import {
  FindTotalCard,
  PercentOfCard,
  PercentageChangeCard,
  PercentageDifferenceCard,
  ValueChangeCard,
  WhatPercentCard,
} from "./calculator/cards";

const PercentageCalculator = () => {
  return (
    <div className="calculator-grid-enter grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      <div className="md:col-span-2 lg:row-span-2">
        <PercentOfCard />
      </div>
      <WhatPercentCard />
      <PercentageChangeCard />
      <FindTotalCard />
      <PercentageDifferenceCard />
      <ValueChangeCard />
    </div>
  );
};

export default PercentageCalculator;
