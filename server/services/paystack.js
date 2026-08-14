import { env } from '../config/env.js';

const BASE_URL = 'https://api.paystack.co';

async function paystackRequest(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.paystackSecretKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.status) {
    const message = data?.message || `Paystack request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export function initializeTransaction({ email, amountKobo, reference, callbackUrl, metadata }) {
  return paystackRequest('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email,
      amount: String(amountKobo),
      currency: 'NGN',
      reference,
      callback_url: callbackUrl,
      metadata: JSON.stringify(metadata),
    }),
  });
}

export function verifyTransaction(reference) {
  return paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`, { method: 'GET' });
}

export function refundTransaction(transaction, amountKobo) {
  const body = { transaction };
  if (amountKobo) body.amount = String(amountKobo);
  return paystackRequest('/refund', { method: 'POST', body: JSON.stringify(body) });
}
