import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom";
import Menu from "../Components/Menu";
import ArticlesPlanner from "../Pages/ArticlesPlanner";
import Categories from "../Pages/Categories";
import CategoryArticles from "../Pages/Categories/CategoryArticles";
import ContentEditor from "../Pages/ContentEditor/Article";
import Home from "../Pages/Home";
import Jobs from "../Pages/Jobs";
import Keywords from "../Pages/Keywords";
import Login from "../Pages/Login";
import Posts from "../Pages/Posts";
import ResultReview from "../Pages/ResultReview";
import Configurations from "../Pages/Configurations";
import ImagesManagement from "../Pages/ImangesManagement";
import Backlinks from "../Pages/Backlinks";

const Routes = ({activeSession}: IRoutes) => {
  return (
    <Router>
      <div>
        <Menu/>
        <Switch>
          <Route path="/category/:category/articles" element={<Protected {...{activeSession}}><CategoryArticles/></Protected>}/>
          <Route path="/category" element={<Protected {...{activeSession}}><Categories/></Protected>}/>
          <Route path="/config" element={<Protected {...{activeSession}}><Configurations/></Protected>}/>
          <Route path="/images" element={<Protected {...{activeSession}}><ImagesManagement/></Protected>}/>
          <Route path="/backlinks" element={<Protected {...{activeSession}}><Backlinks/></Protected>}/>
          <Route path="/posts" element={<Protected {...{activeSession}}><Posts/></Protected>}/>
          <Route path="/result-review" element={<Protected {...{activeSession}}><ResultReview/></Protected>}/>
          <Route path="/content-editor/:id" element={<Protected {...{activeSession}}><ContentEditor/></Protected>}/>
          <Route path="/keywords" element={<Protected {...{activeSession}}><Keywords/></Protected>}/>
          <Route path="/keywords/:id" element={<Protected {...{activeSession}}><Keywords/></Protected>}/>
          <Route path="/" element={<Protected {...{activeSession}}><Home/></Protected>}/>
          <Route path="/login" element={<UnProtected {...{activeSession}}><Login /></UnProtected>} />

          <Route path="/jobs" element={<Protected {...{activeSession}}><Jobs/></Protected>}/>
          <Route path="/jobs/:id" element={<Protected {...{activeSession}}><ArticlesPlanner/></Protected>}/>
        </Switch>
      </div>
    </Router>
  );
}

interface IRoutes {
  activeSession: boolean;
}

const Protected = ({ activeSession, children }: any) => {
  return activeSession ? children : <Navigate to={{ pathname: '/login' }} />
};

const UnProtected = ({ activeSession, children }: any) => {
  return activeSession ? <Navigate to={{ pathname: '/' }} /> : children
};

export default Routes;