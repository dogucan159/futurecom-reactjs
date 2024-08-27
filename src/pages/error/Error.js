import { Link, useRouteError } from "react-router-dom";
import PageContent from "../../components/page-content/PageContent";

const ErrorPage = () => {
  const error = useRouteError();
  let title = "An error occurred!";

  console.log(error);
  return (
    <>
      <PageContent title={title}>
        <p>{error.data.message ?? error.data}</p>
        <p>
          Back to <Link to="/">Home</Link> page
        </p>
      </PageContent>
    </>
  );
};

export default ErrorPage;
