import { RequestHandler } from "express";
import config from "config";
import axios from "axios";

import PaymentEventModel from "../../models/payment-event";
import { PaymentEvent } from "../../types/payments";

export const processEvent: RequestHandler<any, any, PaymentEvent> = async (
  req,
  res,
  next
) => {
  try {
    const secretHash = config.get("flutterwaveSecretHash");

    const signature = req.headers["verif-hash"];

    if (!signature || signature !== secretHash) {
      return res.status(401).end();
    }

    const payload = req.body;

    // Event exists and status hasn't changed. Discard request.
    const existingEvent = await PaymentEventModel.findOne({ id: payload.id });
    if (existingEvent && existingEvent.status === payload.status) {
      return res.status(200).end();
    }

    res.status(200).end();

    // Event exists and status has changed. Update.
    if (existingEvent && existingEvent.status !== payload.status) {
      await PaymentEventModel.updateOne(
        { id: payload.id },
        { status: payload.status }
      );
    }

    if (!existingEvent) {
      await new PaymentEventModel({
        id: payload?.id,
        eventType: payload["event.type"],
        txRef: payload?.txRef,
        flwRef: payload?.flwRef,
        amount: payload?.amount,
        chargedAmount: payload?.charged_amount,
        status: payload?.status,
        customer: {
          id: payload?.customer?.id,
          fullName: payload?.customer?.fullName,
          phoneNumber: payload?.customer?.phone,
          email: payload?.customer?.email,
          createdAt: payload?.customer?.createdAt,
        },
        entity: {
          accountNumber: payload?.entity?.account_number,
          firstName: payload?.entity?.first_name,
          lastName: payload?.entity?.last_name,
          createdAt: payload?.entity?.createdAt,
        },
      }).save();
    }

    // Event exists and status has changed to successful,
    // or a new event with successful status. Give value.
    if (
      (existingEvent &&
        existingEvent.status !== "successful" &&
        payload.status === "successful") ||
      (!existingEvent && payload.status === "successful")
    ) {
      const userId = payload.txRef.split("USER_ID=")[1];
      const url: string = `${config.get(
        "appApiUrl"
      )}orders/place-order/${userId}`;

      await axios({
        url,
        method: "post",
        headers: {
          "x-endpoint-call-hash": config.get("internalEndpointSecretHash"),
        },
      });
    }
  } catch (e) {
    next(new Error("Error in processing payment event: " + e));
  }
};
