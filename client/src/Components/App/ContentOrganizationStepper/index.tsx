import { Divider, Steps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getArticleByInternalId, selectArticle } from "../../../features/article/articleSlice";
import CustomButton from "../../CustomButton";
import CustomLoader from "../../CustomLoader";
import CustomModal from "../../CustomModal";
import { CustomStepProps } from "../SearchKeywordsStepper/ISearchKeywordsStepper";
import ArticleContent from "./ArticleContent/ArticleContent";
import IContentOrganizationStepper from "./IContentOrganizationStepper";

const ContentOrganizationStepper: React.FC<IContentOrganizationStepper> = ({open, setOpen, article}) => {
    const dispatch = useAppDispatch();
    const [current, setCurrent] = useState(0);

    const db = useAppSelector(selectArticle);

    useEffect(() => {
        if(article)
            dispatch(getArticleByInternalId(article.internalId));
    }, [article]);

    const footerOptions = useMemo(() => [
      //<CustomButton key="back_btn-1" loading={createUpdateStatus === 'loading'} onClick={saveContentKeyword}>Save</CustomButton>,
      //<CustomButton key="back_btn-2" disabled={current === 0} type="primary" danger>Back</CustomButton>,
      //<CustomButton key="next_btn-3" type="primary">Next</CustomButton>,
    ], [])

    const stepsItems: Array<CustomStepProps> = useMemo((): Array<CustomStepProps> =>  [
        { 
            title: ``,
            status: 'wait',
            description: '',
            content: <ArticleContent {...{article: db.article}}/>
        }
    ], [db.article]);

    const onChange = (value: number) => {
        setCurrent(value);
    };

    const currentStep = useMemo(() => stepsItems[current] ? stepsItems[current].content : <h1>step not defined</h1>, [stepsItems, current]);

    if(db.status === "loading") return <CustomLoader/>

    return (
        <CustomModal {...{open, setOpen}} style={{marginBottom: 20, marginTop: 20}} width="80%" footer={footerOptions}>
            <div style={{marginBottom: 15}}><h3>AI Content Organization - {db.article.title}</h3></div>
            <Steps
                current={current}
                onChange={onChange}
                items={stepsItems}
            />
            <Divider />
            <div style={{minHeight: '450px'}}>
                {currentStep}
            </div>
        </CustomModal>
    )
}

export default ContentOrganizationStepper;