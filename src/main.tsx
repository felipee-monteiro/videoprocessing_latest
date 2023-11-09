import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Result from "./components/Result.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/success",
    element: <Result />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider fallbackElement={<h1>Carregando...</h1>} router={router} />
);
