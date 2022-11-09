export interface Transaction {
  _id: string;
  type: "Credit" | "Debit";
  amount: number;
  entity: {
    id: string;
    name: string;
  };
  beneficiary?: {
    id: string;
    name: string;
  };
  description: string;
  meta?: {
    accountDetails: {
      bankName: string;
      accountName: string;
      accountNumber: string;
      accountType: "Savings" | "Current";
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GetTransactionsResBody {
  message: string;
  data?: Transaction[];
}

export interface GetBalanceResBody {
  message: string;
  data?: number;
}

export interface InitiateWithdrawalReqBody {
  amount: number;
  shopId: string;
}
