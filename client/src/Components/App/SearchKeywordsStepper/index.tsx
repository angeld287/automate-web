import { Divider, Popover, Steps } from "antd";
import { useMemo, useState } from "react";
import CustomButton from "../../CustomButton";
import CustomModal from "../../CustomModal";
import SearchKeyword from "../SearchKeyword";
import ISearchKeywordsStepper, { CustomStepProps } from "./ISearchKeywordsStepper";

const SearchKeywordsStepper: React.FC<ISearchKeywordsStepper> = ({subtitles, onNext, open, setOpen}) => {
    const [current, setCurrent] = useState(0);
    
    const onChange = (value: number) => {
      onNext()
      setCurrent(value);
    };

    const footerOptions = useMemo(() => [
      <CustomButton key="back_btn-1" disabled={current === 0} danger>Back</CustomButton>,
      <CustomButton key="next_btn-2" type="primary">Next</CustomButton>,
    ], [current])

    const stepsItems: Array<CustomStepProps> = useMemo((): Array<CustomStepProps> =>  subtitles.map((subtitle, index) => ({ 
      title: `Keyword ${index+1}`, 
      description: <Popover key={`key-${subtitle.id}`} content={<p>{subtitle.name}</p>}>{`${subtitle.name.substring(0, 23 - (subtitles.length * 1.5) )}...`}</Popover>,
      content: <SearchKeyword {...{subtitle}}/>
    })), [subtitles]);

    const currentStep = useMemo(() => stepsItems[current] ? stepsItems[current].content : <h1>step not defined</h1>, [stepsItems, current]);

    return (
      <CustomModal {...{open, setOpen}} style={{marginBottom: 20, marginTop: 20}} width="80%" footer={footerOptions}>
        <Steps
          current={current}
          onChange={onChange}
          items={stepsItems}
        />
        <Divider />
        <div style={{minHeight: '600px'}}>
          {currentStep}
        </div>
      </CustomModal>
    )
}

export default SearchKeywordsStepper;