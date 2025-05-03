
import LoginSignup,{loader as LoginLoader,action as loginAction} from '../components/LoginSignup/LoginSignup'
import { BrowserRouter ,Routes,Route,Link, Outlet,RouterProvider,createBrowserRouter,createRoutesFromElements } from 'react-router-dom'
import Home,{loader as homeLoader} from '../components/Home/Home'
import Problems,{loader as problemsLoader} from '../components/Problems/Problems'
import ProblemDetail,{loader as problemLoader} from '../components/ProblemDetail/ProblemDetail'
import Layout from "../components/Layout/Layout"
import Submit ,{action as submitAction,loader as submitLoader}from '../components/Submit/Submit'
import Status,{loader as statusLoader} from '../components/Status/Status'
import ProblemLayout from '../components/ProblemLayout/ProblemLayout'
import Competitions,{loader as competitionsLoader} from '../components/Competitions/Competitions'
import Scoreboard ,{loader as scoreboardLoader}from '../components/Scoreboard/Scoreboard'
import CompetitionLayout,{loader as competitionLayoutLoader} from '../components/CompetitionLayout/CompetitionLayout'
import Profile,{loader as profileLoder} from '../components/Profile/Profile'
import NotFound from '../components/NotFound/NotFound'
import Error from '../components/Error/Error'
import { requireAuth } from './utils'
import Clarification,{loader as clarificationLoader} from '../components/Clarification/Clarification'
import CompetitionProblems,{loader as competitionproblemsLoader} from '../components/CompetitionProblems/CompetitionProblems'
import { AuthProvider } from './AuthContext';

const router =createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<Layout/>}  /*errorElement={<Error/>}*/>
            <Route path="*" element={<NotFound/>}/>
            <Route index element={<Home />} loader={homeLoader}/>
            <Route path="login" element={<LoginSignup/>} loader={LoginLoader} action={loginAction}/>
            <Route path="profile/:name" element={<Profile/>} loader={profileLoder}/>
            
            <Route path="problems" element={<Outlet/>}>
              <Route index element={<Problems/>} loader={problemsLoader}/>
                <Route path=":id" element={<ProblemLayout/>}>
                  <Route index element={<ProblemDetail/>} loader={problemLoader }/>
                  <Route path="submit" element={<Submit/>} loader={submitLoader} action={submitAction}/>
                  <Route path="status" element={<Status/>} loader={statusLoader} />
                  <Route path="clarification" element={<Clarification/>} loader={clarificationLoader}/>
              </Route>
            </Route>

            <Route path="competitions" element={<Competitions/>} loader={competitionsLoader}/>
            <Route path="competitions/:id" element={<CompetitionLayout/>} loader={competitionLayoutLoader}>
              <Route index element={<CompetitionProblems/>} loader={competitionproblemsLoader}/>
              <Route path="Problems" element={<CompetitionProblems/>} loader={competitionproblemsLoader}/>
              <Route path="submit" element={<Submit/>} action={submitAction}  />
              <Route path="scoreboard" element={<Scoreboard/>} loader={scoreboardLoader}/>
            </Route>
        </Route>
))
function App() {
  
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider> 
  )
}

export default App
