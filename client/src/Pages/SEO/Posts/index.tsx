import { useEffect } from "react";
import { setModule } from "../../../features/userSession/userSessionSlice";
import { useAppDispatch } from "../../../app/hooks";

const Posts = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setModule("seo"))
    }, []);
    return <h2>Posts</h2>;
}

export default Posts;