import MercadoPagoConfig, { Payment } from 'mercadopago';

export type PaymentData = {
  email: string | undefined;
  description: string;
  firstName: string;
  lastName: string;
  externalRef: string;
};

export class PixGenerator {
  private readonly payment: Payment;

  public constructor(accessToken: string) {
    if (accessToken == null || accessToken.trim() == '')
      throw new Error("Client can't be null or empty");

    const client = new MercadoPagoConfig({
      accessToken: accessToken,
    });

    this.payment = new Payment(client);
  }

  public async createPaymentWithData(data: PaymentData) {
    'use server';

    try {
      const response = await this.payment.create({
        body: {
          transaction_amount: 54.5,
          description: data.description,
          payment_method_id: 'pix',
          payer: {
            email: data.email || 'cliente@exemplo.com',
            first_name: data.firstName,
            last_name: data.lastName,
          },
          external_reference: data.externalRef,
        },
      });

      const qrCodeBase64 =
        response.point_of_interaction?.transaction_data?.qr_code_base64;
      const qrCode = response.point_of_interaction?.transaction_data?.qr_code;
      const paymentId = String(response.id);
      const status = response.status || 'pending';

      // if (paymentId && paymentId !== 'undefined') {
      //   await savePayment(paymentId, userId, status);
      // }

      return {
        success: true,
        paymentId,
        qrCodeBase64,
        qrCode,
        status: status,
      };
    } catch (error: any) {
      console.error('Erro ao criar pagamento PIX:', error);
      return {
        success: false,
        error: error.message || 'Erro ao criar pagamento',
      };
    }
  }

  public async getPaymentById(paymentId: string) {
    const result = await this.payment.get({ id: paymentId });
    return result;
    //const novoStatus: string = result.status || 'unknown';
  }
}
