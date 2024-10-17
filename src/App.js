import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import Card from "./components/reusable/Card";
// import SearchBar from "./components/reusable/SearchBar";
import HomePage from "./pages/HomePage";
import UserProfile from "./components/accountUtilities/UserProfile";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UniversityPage from "./pages/UniversityPage";
import ScholarshipPage from "./pages/ScholarshipPage";
import VerificationPage from "./pages/VerificationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ScholarshipDetailPage from "./pages/ScholarshipDetailPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import DashboardComponent from "./components/accountUtilities/sidebarComponents/Admin/Dashboard";
import DiscussionsPage from "./pages/DiscussionPage";
import HealthPage from "./pages/HealthPage";
import PublicOnlyROute from "./components/routes/PublicOnlyRoute";
import CreateDiscussionPage from "./pages/CreateDiscussionPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VisitProfile from "./components/accountUtilities/sidebarComponents/User/VisitProfile";
import LivelihoodPage from "./pages/LivelihoodPage";
import JobPage from "./pages/JobPage";
import JobDetailPage from "./pages/JobDetailPage";
import StudentLoanPage from "./pages/StudentLoanPage";
import AccommodationPage from "./pages/AccommodationPage";
import AccommodationDetailPage from "./pages/AccommodationDetailPage";
import ErrorPage from "./pages/ErrorPage";
import UniversityDetailPage from "./pages/UniversityDetailPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  { path: "/login",element: <LoginPage />},
  { path: "/signup",element: <PublicOnlyROute><RegisterPage /></PublicOnlyROute>},
  { path: "/forget-password", element: <PublicOnlyROute><ForgetPasswordPage /></PublicOnlyROute>},
  { path: "/reset-password/:token", element: <ResetPasswordPage />},
  { path: "/terms-and-conditions", element: <PublicOnlyROute><TermsAndConditionsPage/></PublicOnlyROute>},
  { path: "/signup/verification", element: <PublicOnlyROute><VerificationPage/></PublicOnlyROute> },
  { path: "/dashboard/:userName", element: <DashboardComponent/> },
  { path: "/profile/:userName", element: <UserProfile/> },
  { path: "/discussions", element: <DiscussionsPage/> },
  { path: "/discussions/create", element: <CreateDiscussionPage/> },
  { path: "/health", element: <HealthPage/>},
  { path: "/user/:userId", element: <VisitProfile /> },
  // {
  //   path: "/universities",
  //   element: <UniversityPage />,
  //   children: [
  //     { path: "search", element: <UniversityPage /> },
  //     { path: ":id", element: <UniversityDetail/> }
  //   ]
  // },
  {
    path: "/list",
    children: [
      { path: "job", element: <JobPage /> },
      { path: "university", element: <UniversityPage/>},
      { path: "scholarship", element: <ScholarshipPage/>},
      { path: "student-loan", element: <StudentLoanPage /> },
      { path: "accommodation", element: <AccommodationPage /> },
    ]
  },  
  {
    path: "/detail",
    children: [
      { path: "university/:id", element: <UniversityDetailPage /> },
      { path: "scholarship/:id", element: <ScholarshipDetailPage /> },
      { path: "job/:id", element: < JobDetailPage/>}
    ]
  },  
  
  { path: "/login",element: <LoginPage />},
  { path: "/signup",element: <RegisterPage />},
  { path: "/scholarships", element: <ScholarshipPage/>},
  { path: "/profile/:userName", element: <UserProfile /> },
  { path: "/job-detail/:jobId", element: <JobDetailPage/> },
  { path: "/forget-password", element: <ForgetPasswordPage />},
  { path: "/signup/verification", element: <VerificationPage/> },
  { path: "/dashboard/:userName", element: <DashboardComponent/> },
  { path: "/profile/:userName", element: <UserProfile /> },
  { path:"/livelihood", element: <LivelihoodPage />},
  { path: "/scholarships", element: <ScholarshipPage /> },
  { path: "/scholarship/:id", element: <ScholarshipDetailPage /> },
  { path: "/student-loans", element: <StudentLoanPage /> },
  { path: "/accommodations", element: <AccommodationPage /> },
  {path:"/accommodation-detail/:id",element:<AccommodationDetailPage />},

]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

