import { Request, Response } from "express";
import purchasesService from "../services/purchases.service";
import HttpStatusCode from "../helpers/http_status_code";
import { successResponse } from "../helpers/http_responses";

class PurchasesController {
  getPurchases = async (_: Request, res: Response) => {
    const result = await purchasesService.getPurchases();

    if (result) {
      successResponse(res, result, HttpStatusCode.OK);
    }
  };

  createPurchase = async (req: Request, res: Response) => {
    const body = req.body;

    const purchaseExists = await purchasesService.getPurchases({
      pessoa_id: body.pessoa_id,
      numero_documento: body.numero_documento,
      serie_documento: body.serie_documento,
    });

    if (purchaseExists.length > 0) {
      res.status(HttpStatusCode.CONFLICT);
      res.json({ message: "Duplicated purchase" });
      return;
    }

    const purchase = await purchasesService.createPurchase(body);

    if (purchase) {
      successResponse(res, purchase, HttpStatusCode.CREATED);
    }
  };

  showPurchase = async (req: Request, res: Response) => {
    const id = req.params.id;
    const purchase = await purchasesService.showPurchase(+id);

    if (purchase) {
      successResponse(res, purchase, HttpStatusCode.OK);
    }
  };
}

export default new PurchasesController();
