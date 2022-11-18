export interface PaymentEvent {
  "event.type": string;
  data: {
    id: string;
    tx_ref: string;
    flw_ref: string;
    amount: string;
    charged_amount: string;
    status: string;
    customer: {
      id: number;
      name: string;
      phone_number: string;
      email: string;
      created_at: string;
    };
  };
}

export interface CustomPaymentEvent {
  _id: string;
  id: string;
  eventType: string;
  txRef: string;
  flwRef: string;
  amount: string;
  status: string;
  customer: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    createdAt: string;
  };
}

export interface BankTransferReqData {
  amount: number;
  email: string;
}

export interface BankTransferResData {
  status: "success" | "error";
  message: string;
  meta?: {
    authorization: {
      transfer_reference: string;
      transfer_account: string;
      transfer_bank: string;
      account_expiration: string;
      transfer_note: string;
      transfer_amount: number;
      mode: string;
    };
  };
}

export interface TransferReqData {
  bankName: string;
  accountNumber: string;
  amount: number;
}

export interface TransferResData {
  status: "success" | "error";
  message: string;
  data?: {
    id: number;
    bank_name: string;
    account_number: string;
    bank_code: string;
    full_name: string;
    created_at: string;
    currency: string;
    debit_currency: string;
    amount: number;
    fee: number;
    status: string;
    reference: string;
    narration: string;
    complete_message: string;
  };
}

export interface BankTransferResBody {
  message: string;
  data?: BankTransferResData;
}
