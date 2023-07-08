import { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { setModule } from "../../../features/userSession/userSessionSlice";

const ResultReview = () => {
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(setModule("seo"))
    }, []);

    return <h2>ResultReview</h2>;
}

export default ResultReview;