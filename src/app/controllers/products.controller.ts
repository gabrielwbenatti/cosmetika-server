import { Request, Response } from "express";
import productsService from "../services/products.service";
import { successResponse } from "../helpers/http_responses";
import productsValidator from "../validators/products.validator";
import { HttpStatusCode } from "../helpers/http_status_code";
import { and, eq, ilike, or, SQL } from "drizzle-orm";
import { produtosTable } from "../../db/schema";

class ProductsController {
  getProducts = async (req: Request, res: Response) => {
    const { search, referencia } = req.query;
    const filters: (SQL | undefined)[] = [];

    if (search)
      filters.push(
        or(
          ilike(produtosTable.nome, `%${search}%`),
          ilike(produtosTable.referencia, `%${search}%`)
        )
      );

    if (referencia)
      filters.push(and(eq(produtosTable.referencia, `${referencia}`)));

    const result = await productsService.getProducts(filters);

    if (result) {
      successResponse(res, result, HttpStatusCode.OK, {
        count: result.length,
      });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    const body = req.body;
    const { referencia } = body;

    if (referencia) {
      const isDuplicate = await productsValidator.isReferenceDuplicate(
        referencia
      );

      if (isDuplicate)
        return res
          .status(HttpStatusCode.CONFLICT)
          .json({ message: "Duplicate product" });
    }

    const result = await productsService.createProduct(body);

    if (result) {
      successResponse(res, result, HttpStatusCode.CREATED);
    }
  };

  showProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const product = await productsService.showProduct(+id);

    if (product) {
      successResponse(res, product, HttpStatusCode.OK);
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    const body = req.body;
    const id = req.params.id;
    const product = await productsService.updateProduct(+id, body);

    if (product) {
      successResponse(res, product, HttpStatusCode.OK);
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const product = await productsService.deleteProduct(+id);
    if (product) {
      successResponse(res, product, HttpStatusCode.OK);
    }
  };
}

export default new ProductsController();
