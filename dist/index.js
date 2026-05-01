import MercadoPagoConfig, { Payment } from 'mercadopago';
/**
 * Serviço responsável por interagir com o Mercado Pago para pagamentos PIX
 */
export class PixService {
    payment;
    /**
     * Inicializa o client do Mercado Pago
     * @param accessToken Token de acesso da API
     */
    constructor(accessToken) {
        if (!accessToken || accessToken.trim() === '') {
            throw new Error('Access token cannot be empty');
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
    async createPixPayment(data) {
        if (data.value <= 0) {
            throw new Error('Transaction amount must be greater than zero');
        }
        try {
            const response = await this.payment.create({
                body: {
                    transaction_amount: data.value,
                    description: data.description,
                    payment_method_id: 'pix',
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
                    status: response.status ?? 'pending',
                },
                error: null,
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao criar pagamento';
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
    async getPaymentById(paymentId) {
        try {
            return await this.payment.get({ id: paymentId });
        }
        catch {
            throw new Error('Error on search for payment with id: ' + paymentId);
        }
    }
}
//# sourceMappingURL=index.js.map