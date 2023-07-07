import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom";
import Menu from "../Components/Menu";
import ArticlesPlanner from "../Pages/SEO/ArticlesPlanner";
import Categories from "../Pages/SEO/Categories";
import CategoryArticles from "../Pages/SEO/Categories/CategoryArticles";
import ContentEditor from "../Pages/SEO/ContentEditor/Article";
import Home from "../Pages/SEO/AllArticles";
import Jobs from "../Pages/SEO/Jobs";
import Keywords from "../Pages/SEO/Keywords";
import Login from "../Pages/Login";
import Posts from "../Pages/SEO/Posts";
import ResultReview from "../Pages/SEO/ResultReview";
import Configurations from "../Pages/SEO/Configurations";
import ImagesManagement from "../Pages/SEO/ImangesManagement";
import Backlinks from "../Pages/SEO/Backlinks";

const Routes = ({activeSession}: IRoutes) => {
  return (
    <Router>
      <div>
        <Menu/>
        <Switch>
          
          {/* SEO Routes */}
          <Route path="/site/category/:category/articles" element={<Protected {...{activeSession}}><CategoryArticles/></Protected>}/>
          <Route path="/site/category" element={<Protected {...{activeSession}}><Categories/></Protected>}/>
          <Route path="/site/config" element={<Protected {...{activeSession}}><Configurations/></Protected>}/>
          <Route path="/site/images" element={<Protected {...{activeSession}}><ImagesManagement/></Protected>}/>
          <Route path="/site/backlinks" element={<Protected {...{activeSession}}><Backlinks/></Protected>}/>
          <Route path="/site/posts" element={<Protected {...{activeSession}}><Posts/></Protected>}/>
          <Route path="/site/result-review" element={<Protected {...{activeSession}}><ResultReview/></Protected>}/>
          <Route path="/site/content-editor/:id" element={<Protected {...{activeSession}}><ContentEditor/></Protected>}/>
          <Route path="/site/keywords" element={<Protected {...{activeSession}}><Keywords/></Protected>}/>
          <Route path="/site/keywords/:id" element={<Protected {...{activeSession}}><Keywords/></Protected>}/>
          <Route path="/site/jobs" element={<Protected {...{activeSession}}><Jobs/></Protected>}/>
          <Route path="/site/jobs/:id" element={<Protected {...{activeSession}}><ArticlesPlanner/></Protected>}/>


          <Route path="/" element={<Protected {...{activeSession}}><Home/></Protected>}/>
          <Route path="/login" element={<UnProtected {...{activeSession}}><Login /></UnProtected>} />
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