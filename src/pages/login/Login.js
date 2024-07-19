import { LoginForm } from "../../components";
import { SingleCard } from "../../layouts";

const LoginPage = () => {
  return (
    <SingleCard title="Sign In">
      <LoginForm
        resetLink="send-reset-password-mail"
        createAccountLink="create-account"
      ></LoginForm>
    </SingleCard>
  );
};

export default LoginPage;
