import { lazy } from "react";

// CLIENT PAGES
export const Home = lazy(() => import("./client/Home"));
export const ApplyJob = lazy(() => import("./client/ApplyJob"));
export const ViewJob = lazy(() => import("./client/ViewJob"));
export const NotFoundPage = lazy(() => import("./NotFoundPage"));

// ADMIN PAGES
export const Login = lazy(() => import("./admin/Login"));
export const Dashboard = lazy(() => import("./admin/Dashboard"));
export const Jobs = lazy(() => import("../pages/admin/Job/Jobs"));
export const Applicants = lazy(() => import("./admin/Applicants/Applicants"));
export const ViewApplicantRecord = lazy(() => import("./admin/Applicants/ViewApplicantRecord"));
export const ViewJobDetails = lazy(() => import("./admin/Job/ViewJobDetails"));
export const AddJobDetails = lazy(() => import("./admin/Job/AddJobDetails"));
