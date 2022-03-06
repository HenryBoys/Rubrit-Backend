import express, { Request, Response } from "express";
import axios from "axios";
import env from "../../environment";

const app = express.Router();

app.get("/plan", async (req: Request, res: Response) => {
  try {
    const id = env.mercado_pago.preapproval_plan;
    if (!id) return res.status(400).json("Please provide an id");

    let { data } = await axios.get(
      `https://api.mercadopago.com/preapproval_plan/${id}`,
      {
        headers: {
          Authorization: `Bearer ${env.mercado_pago.access_token}`,
        },
      }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
});

interface IFT {
  frequency_type?: string;
  frequency?: string;
}
interface IAR {
  frequency: string;
  frequency_type: string;
  transaction_amount: number;
  currency_id: string;
  repetitions?: number;
  free_trial?: IFT;
}
interface IPlan {
  back_url?: string;
  reason: string;
  auto_recurring: IAR;
}

app.post("/plan", async (req: Request, res: Response) => {
  try {
    const newPlan: IPlan = { ...req.body };

    let { data } = await axios.post(
      `https://api.mercadopago.com/preapproval_plan`,
      newPlan,
      {
        headers: {
          Authorization: `Bearer ${env.mercado_pago.access_token}`,
        },
      }
    );

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

app.put("/plan", async (req: Request, res: Response) => {
  try {
    const id = env.mercado_pago.preapproval_plan;
    const newPlan: IPlan = { ...req.body };

    let { data } = await axios.put(
      `https://api.mercadopago.com/preapproval_plan/${id}`,
      newPlan,
      {
        headers: {
          Authorization: `Bearer ${env.mercado_pago.access_token}`,
        },
      }
    );

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

interface IGetPayer {
  sort?: string; //date_created:desc
  limit?: string; //10
  status?: string; //authorized,paused,cancelled
  offset?: string; //0
  preapproval_plan_id?: string;
  payerId?: string;
  payer_email?: string;
}

//payer routes
app.get("/payer", async (req: Request, res: Response) => {
  try {
    const params: IGetPayer = {
      preapproval_plan_id: env.mercado_pago.preapproval_plan,
      ...req.query,
    };
    let payers = await axios.get(
      `https://api.mercadopago.com/preapproval/search`,
      {
        params,
        headers: {
          Authorization: `Bearer ${env.mercado_pago.access_token}`,
        },
      }
    );
    res.status(200).json(payers.data);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

app.post("/payer", async (req: Request, res: Response) => {
  try {
    const preapproval_plan_id = env.mercado_pago.preapproval_plan;
    const { card_token_id, payer_email } = req.body;
    let { data } = await axios.post(
      `https://api.mercadopago.com/preapproval`,
      {
        preapproval_plan_id,
        card_token_id,
        payer_email,
      },
      {
        headers: {
          Authorization: `Bearer ${env.mercado_pago.access_token}`,
        },
      }
    );

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

app.put("/payer/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    //body: possible fields
    //update amount or card
    // {
    //   "application_id": 1234567812345678,
    //   "auto_recurring": {
    //     "currency_id": "ARS",
    //     "transaction_amount": 100
    //   },
    //   "card_token_id":"1aca87c7338585abdf1edf0000000000"
    // }
    //update status: authorized, paused, cancelled(not reversible)
    // {
    //   "status": "cancelled"
    // }
    let { data } = await axios.put(
      `https://api.mercadopago.com/preapproval/${id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${env.mercado_pago.access_token}`,
        },
      }
    );

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});
export default app;
