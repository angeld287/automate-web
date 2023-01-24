import { Divider, Popover, Steps } from "antd";
import { useState } from "react";
import ISearchKeywordStepper from "./ISearchKeywordStepper";

const SearchKeywordStepper: React.FC<ISearchKeywordStepper> = ({subtitles, onNext}) => {
    const [current, setCurrent] = useState(0);
    
    const onChange = (value: number) => {
      onNext()
      setCurrent(value);
    };

    return (
      <>
        <Steps
          current={current}
          onChange={onChange}
          items={subtitles.map((subtitle, index) => ({title: `Keyword ${index+1}`, description: <Popover content={<p>{subtitle.name}</p>}>{`${subtitle.name.substring(0, 23 - (subtitles.length * 1.5) )}...`}</Popover>}))}
        />
        <Divider />
      </>
    )
}

export default SearchKeywordStepper;