import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, token, otpRequired, forgotPasswordStep } = useSelector((state) => state.auth);

  return {
    user,
    token,
    isAuthenticated: !!token,
    otpRequired,
    forgotPasswordStep,
  };
};
