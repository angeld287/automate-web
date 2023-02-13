import { EditOutlined } from "@ant-design/icons";
import { Avatar, Card, Skeleton } from "antd";
import Meta from "antd/es/card/Meta";

import React, { useEffect, useMemo, useState } from "react";
import CustomButton from "../../../Components/CustomButton";
//import { searchKeywordContent } from "../../../features/keyword/keywordAPI";
import { IParagraph } from "./IParagraph";

const Paragraph: React.FC<IParagraph> = ({ content, index }) => {
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        let didCancel = false;

        if(content.content && content.content.find(paragraph => paragraph.selected)) setLoading(false);
        return () => {
            didCancel = false;
        }
    }, [content]);

    const contentText = useMemo(() => content?.content?.filter(paragraph => paragraph.selected).map(paragraph => <p key={paragraph.id}>{paragraph.content}</p>),[content]);

    const paragraphRequireImage = useMemo(() => (index === 1 || index === 3), [index])

    return (<Card
        style={{ width: '100%', marginTop: 16 }}
        actions={[
            <CustomButton onClick={() => {}}>Edit Content<EditOutlined /></CustomButton>,
          ]
        }
        extra={
          !loading && (
            <img
              width={200}
              alt="imagd"
              src="https://cdn.shopify.com/s/files/1/2216/9173/files/Aceite_de_coco_sqre.jpg"
            />
          )
        }
    >
        <Skeleton loading={loading} avatar={ paragraphRequireImage ? {shape: "square", size: 100} : false} active>
            <Meta
                style={{textAlign: "left"}}
                avatar={<Avatar src="https://cdn.shopify.com/s/files/1/2216/9173/files/Aceite_de_coco_sqre.jpg" />}
                title={`${content?.name.charAt(0).toUpperCase()}${content?.name.slice(1)}`}
                description={contentText}
            />
        </Skeleton>
    </Card>)
}

export default Paragraph;