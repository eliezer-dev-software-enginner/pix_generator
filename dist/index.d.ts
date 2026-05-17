import type { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';
/**
 * Configuração do serviço PIX
 */
export type PixConfig = {
    accessToken: string;
    emulator?: {
        enabled: boolean;
        url?: string;
    };
};
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
    notificationUrl?: string;
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
 * Serviço responsável por interagir com o Mercado Pago para pagamentos PIX.
 * Suporta modo emulador para testes locais.
 */
export declare class PixService {
    private readonly payment;
    private readonly emulatorUrl;
    constructor(config: PixConfig);
    /**
     * Cria um pagamento PIX
     * @param data Dados do pagamento
     * @returns Resultado com QR Code e status
     */
    createPixPayment(data: PaymentData): Promise<PixPaymentResult>;
    private createPixPaymentMercadoPago;
    private createPixPaymentEmulator;
    /**
     * Busca um pagamento pelo ID
     * @param paymentId ID do pagamento
     * @returns Dados completos do pagamento
     */
    getPaymentById(paymentId: string): Promise<PaymentResponse>;
    private getPaymentByIdMercadoPago;
    private getPaymentByIdEmulator;
}
//# sourceMappingURL=index.d.ts.map