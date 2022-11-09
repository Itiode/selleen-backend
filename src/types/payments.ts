export interface PaymentEvent {
  id: string;
  "event.type": string;
  type: "BANK_TRANSFER_TRANSACTION";
  txRef: string;
  flwRef: string;
  amount: string;
  charged_amount: string;
  status: string;
  customer: {
    id: number;
    fullName: string;
    phone: string;
    email: string;
    createdAt: string;
  };
  entity: {
    account_number: string;
    first_name: string;
    last_name: string;
    createdAt: string;
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
  entity: {
    accountNumber: string;
    firstName: string;
    lastName: string;
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
