import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
/**
 * Dados necessários para gerar um pagamento via PIX
 */
export type PaymentData = {
    email: string;
    description: string;
    firstName: string;
    lastName: string;
    externalRef: string;
    value: number;
    metadata?: Record<string, any>;
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
export declare class MercadoPagoPixService {
    private readonly payment;
    /**
     * Inicializa o client do Mercado Pago
     * @param accessToken Token de acesso da API
     */
    constructor(accessToken: string);
    /**
     * Cria um pagamento PIX
     * @param data Dados do pagamento
     * @returns Resultado com QR Code e status
     */
    createPixPayment(data: PaymentData): Promise<PixPaymentResult>;
    /**
     * Busca um pagamento pelo ID
     * @param paymentId ID do pagamento
     * @returns Dados completos do pagamento
     */
    getPaymentById(paymentId: string): Promise<PaymentResponse>;
}
//# sourceMappingURL=index.d.ts.map