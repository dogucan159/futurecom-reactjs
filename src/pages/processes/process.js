import { Await, defer, json, useLoaderData } from "react-router-dom";
import { getById as getProcessById } from "../../api/processes";
import { getToken } from "../../utils/auth";
import { Suspense } from "react";
import { LoadPanel } from "devextreme-react";
import ProcessForm from "../../components/process/ProcessForm";
import defaultRichText from "../../utils/default-rich-text";

const ProcessPage = () => {
  const { process } = useLoaderData();

  return (
    <>
      <Suspense fallback={<LoadPanel showPane={false} visible />}>
        <Await resolve={process}>
          {(loadProcess) =>
            loadProcess ? (
              <ProcessForm processData={loadProcess} />
            ) : (
              <ProcessForm
                processData={{
                  baseEntityId: undefined,
                  processCommentRichTextBase64: defaultRichText,
                }}
              />
            )
          }
        </Await>
      </Suspense>
    </>
  );
};

export default ProcessPage;

async function loadProcess(id) {
  try {
    if (id) {
      const token = getToken();
      const process = await getProcessById(id, token.access_token);
      return process;
    }
  } catch (error) {
    throw json({ message: error.message }, { status: 500 });
  }
}

export async function loader({ params }) {
  const id = params.selectedProcessId;
  return defer({
    process: await loadProcess(id),
  });
}
