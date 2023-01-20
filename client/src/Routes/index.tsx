import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom";
import Menu from "../Components/Menu";
import ContentEditor from "../Pages/ContentEditor/Article";
import Home from "../Pages/Home";
import Keywords from "../Pages/Keywords";
import Login from "../Pages/Login";
import Posts from "../Pages/Posts";
import ResultReview from "../Pages/ResultReview";

const Routes = ({activeSession}: IRoutes) => {
  return (
    <Router>
      <div>
        <Menu/>
        <Switch>
          <Route path="/posts" element={<Protected {...{activeSession}}><Posts/></Protected>}/>
          <Route path="/result-review" element={<Protected {...{activeSession}}><ResultReview/></Protected>}/>
          <Route path="/content-editor" element={<Protected {...{activeSession}}><ContentEditor/></Protected>}/>
          <Route path="/content-editor/:id" element={<Protected {...{activeSession}}><ContentEditor/></Protected>}/>
          <Route path="/keywords" element={<Protected {...{activeSession}}><Keywords/></Protected>}/>
          <Route path="/keywords/:id" element={<Protected {...{activeSession}}><Keywords/></Protected>}/>
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