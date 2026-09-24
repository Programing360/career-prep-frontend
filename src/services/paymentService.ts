import api from '../lib/axios';

export interface CreateCheckoutSessionResponse {
  status: string;
  data: {
    url: string;
    sessionId?: string;
  };
}

export const paymentService = {
  /**
   * Stripe Checkout Session তৈরির জন্য API কল
   */
  createCheckoutSession: async (
    type: 'subscription' | 'token',
    itemId: string
  ): Promise<string> => {
    const response = await api.post<CreateCheckoutSessionResponse>(
      '/payment/create-checkout-session',
      { type, itemId }
    );
    // console.log(response);
    return response.data.data.url;
  },
};
