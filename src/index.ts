import MercadoPagoConfig, { Payment } from "mercadopago";
import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

/**
 * Dados necessários para gerar um pagamento via PIX
 */
export type PaymentData = {
  email: string; // Email do pagador (obrigatório)
  description: string; // Descrição do pagamento
  firstName: string;
  lastName: string;
  externalRef: string; // Referência externa (ID interno do sistema)
  value: number; // Valor da transação (deve ser > 0)
};

/**
 * Resultado da criação de pagamento PIX
 */
export type PixPaymentResult = {
  success: boolean;
  data: {
    paymentId: string;
    qrCodeBase64: string | null;
    qrCode: string | null;
    status: string;
  } | null;
  error: string | null;
};

/**
 * Serviço responsável por interagir com o Mercado Pago para pagamentos PIX
 */
export class MercadoPagoPixService {
  private readonly payment: Payment;

  /**
   * Inicializa o client do Mercado Pago
   * @param accessToken Token de acesso da API
   */
  public constructor(accessToken: string) {
    if (!accessToken || accessToken.trim() === "") {
      throw new Error("Access token cannot be empty");
    }

    const client = new MercadoPagoConfig({
      accessToken,
    });

    this.payment = new Payment(client);
  }

  /**
   * Cria um pagamento PIX
   * @param data Dados do pagamento
   * @returns Resultado com QR Code e status
   */
  public async createPixPayment(data: PaymentData): Promise<PixPaymentResult> {
    if (data.value <= 0) {
      throw new Error("Transaction amount must be greater than zero");
    }

    try {
      const response = await this.payment.create({
        body: {
          transaction_amount: data.value,
          description: data.description,
          payment_method_id: "pix",
          payer: {
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
          },
          external_reference: data.externalRef,
        },
      });

      const transactionData = response.point_of_interaction?.transaction_data;

      return {
        success: true,
        data: {
          paymentId: String(response.id),
          qrCodeBase64: transactionData?.qr_code_base64 ?? null,
          qrCode: transactionData?.qr_code ?? null,
          status: response.status ?? "pending",
        },
        error: null,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar pagamento";

      return {
        success: false,
        data: null,
        error: message,
      };
    }
  }

  /**
   * Busca um pagamento pelo ID
   * @param paymentId ID do pagamento
   * @returns Dados completos do pagamento
   */
  public async getPaymentById(paymentId: string): Promise<PaymentResponse> {
    try {
      return await this.payment.get({ id: paymentId });
    } catch {
      throw new Error("Error on search for payment with id: " + paymentId);
    }
  }
}
