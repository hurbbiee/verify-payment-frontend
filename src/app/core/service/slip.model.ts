export interface SlipParty {
  bank: string | null;
  name: string | null;
  account: string | null;
}
export interface SlipResponse {
  success: boolean;
  status: 'VERIFIED' | 'DUPLICATE' | 'UNVERIFIED';
  data: {
    transactionRef: string | null;
    sender: SlipParty;
    receiver: SlipParty;
    amount: number | null;
    currency: string | null;
    transferDateTime: string | null;
  };
}
