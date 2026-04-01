import { useMutation } from '@tanstack/react-query';
import { createCheckoutSession } from '../api/checkout';

export const useCheckoutMutation = ({ onError } = {}) =>
  useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError,
  });
