import { Divider, Popover, Steps } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { crateKeywordContent, selectKeyword } from "../../../features/keyword/keywordSlice";
import { SubTitleContent } from "../../../interfaces/models/Article";
import CustomButton from "../../CustomButton";
import CustomModal from "../../CustomModal";
import SearchKeyword from "../SearchKeyword";
import ISearchKeywordsStepper, { CustomStepProps } from "./ISearchKeywordsStepper";

const SearchKeywordsStepper: React.FC<ISearchKeywordsStepper> = ({subtitles, onNext, open, setOpen}) => {
    const [current, setCurrent] = useState(0);

    const dispatch = useAppDispatch();
    const { createUpdateStatus, finalParagraphs} = useAppSelector(selectKeyword);
    
    const onChange = (value: number) => {
      onNext()
      setCurrent(value);
    };

    const saveContentKeyword = useCallback(() => {
      dispatch(crateKeywordContent(finalParagraphs));
    }, [finalParagraphs]);

    const footerOptions = useMemo(() => [
      <CustomButton key="back_btn-1" loading={createUpdateStatus === 'loading'} onClick={saveContentKeyword}>Save</CustomButton>,
      <CustomButton key="back_btn-2" disabled={current === 0} type="primary" danger>Back</CustomButton>,
      <CustomButton key="next_btn-3" type="primary">Next</CustomButton>,
    ], [current, createUpdateStatus, saveContentKeyword])

    const getSubtitleState = useCallback((subtitle: SubTitleContent, currentStep: number): "wait" | "process" | "finish" => {
      const hasContent = subtitle.content?.find(cont => cont.selected);
      const hasSearchedParagraphs = subtitle.content?.find(cont => !cont.selected);
      return hasContent ? "finish" : hasSearchedParagraphs ? "process" : "wait"
    }, []);

    const stepsItems: Array<CustomStepProps> = useMemo((): Array<CustomStepProps> =>  subtitles.map((subtitle, index) => {
      return ({ 
        title: `Keyword ${index+1}`,
        status: getSubtitleState(subtitle, current), //'wait' | 'process' | 'finish' | 'error'
        description: <Popover key={`key-${subtitle.id}`} content={<p>{subtitle.name}</p>}>{`${subtitle.name.substring(0, 23 - (subtitles.length * 1.5) )}...`}</Popover>,
        content: <SearchKeyword {...{subtitle}}/>
      })
    }), [subtitles, current, getSubtitleState]);

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