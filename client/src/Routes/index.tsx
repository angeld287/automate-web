import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import Menu from "../Components/Menu";
import ContentEditor from "../Pages/ContentEditor/Article";
import Home from "../Pages/Home";
import Keywords from "../Pages/Keywords";
import Posts from "../Pages/Posts";
import ResultReview from "../Pages/ResultReview";

const Routes = () => {
  return (
    <Router>
      <div>
        <Menu/>
        <Switch>
          <Route path="/posts" element={<Posts/>}/>
          <Route path="/result-review" element={<ResultReview/>}/>
          <Route path="/content-editor" element={<ContentEditor/>}/>
          <Route path="/keywords" element={<Keywords/>}/>
          <Route path="/" element={<Home/>}/>
        </Switch>
      </div>
    </Router>
  );
}

export default Routes;