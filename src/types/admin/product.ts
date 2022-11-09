export interface ApproveProductReqBody {
  action: "Approved" | "Disapproved";
  comment: string;
}
