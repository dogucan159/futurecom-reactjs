import { ResetPasswordForm } from "../../components";
import { SingleCard } from "../../layouts";

export const ResetPasswordPage = () => {
  return (
    <SingleCard
      title="Reset Password"
      description="Please enter the email address that you used to register, and we will send you a link to reset your password via Email."
    >
      <ResetPasswordForm signInLink="/" buttonLink="/" />
    </SingleCard>
  );
};

export default ResetPasswordPage;
