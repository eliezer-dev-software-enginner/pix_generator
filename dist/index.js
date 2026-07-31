import { MercadoPagoConfig, Payment } from 'mercadopago';
/**
 * Extrai a melhor mensagem possível de um erro de formato desconhecido.
 * O SDK do Mercado Pago nem sempre rejeita com uma instância de Error - às
 * vezes é um objeto de erro da API (com "message"/"cause"/"error") ou outra
 * coisa. Preferimos sempre devolver algo útil em vez da string genérica.
 */
function extrairMensagemDeErro(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (error && typeof error === 'object') {
        const candidato = error;
        const possivelMensagem = candidato.message ?? candidato.error ?? candidato.cause;
        if (typeof possivelMensagem === 'string' && possivelMensagem.trim() !== '') {
            return possivelMensagem;
        }
        try {
            return JSON.stringify(error);
        }
        catch {
            return String(error);
        }
    }
    return String(error);
}
/**
 * Serviço responsável por interagir com o Mercado Pago para pagamentos PIX.
 * Suporta modo emulador para testes locais.
 */
export class PixService {
    payment;
    emulatorUrl;
    constructor(config) {
        const { accessToken, emulator } = config;
        if (!accessToken || accessToken.trim() === '') {
            throw new Error('Access token cannot be empty');
        }
        if (emulator?.enabled) {
            this.emulatorUrl =
                emulator.url?.replace(/\/$/, '') ?? 'http://localhost:3001';
            this.payment = null;
        }
        else {
            this.emulatorUrl = null;
            const client = new MercadoPagoConfig({ accessToken });
            this.payment = new Payment(client);
        }
    }
    /**
     * Cria um pagamento PIX
     * @param data Dados do pagamento
     * @returns Resultado com QR Code e status
     */
    // ── Criação de pagamento ────────────────────────────────────────────────────
    async createPixPayment(data) {
        if (data.value <= 0) {
            throw new Error('Transaction amount must be greater than zero');
        }
        try {
            if (this.emulatorUrl) {
                return await this.createPixPaymentEmulator(data);
            }
            return await this.createPixPaymentMercadoPago(data);
        }
        catch (error) {
            // Loga o erro bruto (o SDK do Mercado Pago as vezes rejeita com algo
            // que nao e uma instancia de Error, ex.: objetos de erro da API com
            // "cause"/"message" proprios) - sem isso, o chamador so via a string
            // generica abaixo e nao tinha como saber o que de fato falhou.
            console.error('[PixService] Erro ao criar pagamento PIX (Mercado Pago)', error);
            return { success: false, data: null, error: extrairMensagemDeErro(error) };
        }
    }
    async createPixPaymentMercadoPago(data) {
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
                ...(data.notificationUrl && { notification_url: data.notificationUrl }),
                ...(data.metadata && { metadata: data.metadata }),
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
    async createPixPaymentEmulator(data) {
        const res = await fetch(`${this.emulatorUrl}/v1/payments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transaction_amount: data.value,
                description: data.description,
                external_reference: data.externalRef,
                notification_url: data.notificationUrl,
                metadata: data.metadata,
                payer: {
                    email: data.email,
                    first_name: data.firstName,
                    last_name: data.lastName,
                },
            }),
        });
        if (!res.ok)
            throw new Error(`Emulator error: ${res.status}`);
        const json = await res.json();
        const transactionData = json.point_of_interaction?.transaction_data;
        return {
            success: true,
            data: {
                paymentId: String(json.id),
                qrCodeBase64: transactionData?.qr_code_base64 ?? null,
                qrCode: transactionData?.qr_code ?? null,
                status: json.status ?? 'pending',
            },
            error: null,
        };
    }
    /**
     * Busca um pagamento pelo ID
     * @param paymentId ID do pagamento
     * @returns Dados completos do pagamento
     */
    // ── Busca de pagamento ──────────────────────────────────────────────────────
    async getPaymentById(paymentId) {
        if (this.emulatorUrl) {
            return await this.getPaymentByIdEmulator(paymentId);
        }
        return await this.getPaymentByIdMercadoPago(paymentId);
    }
    async getPaymentByIdMercadoPago(paymentId) {
        try {
            return await this.payment.get({ id: paymentId });
        }
        catch {
            throw new Error('Error on search for payment with id: ' + paymentId);
        }
    }
    async getPaymentByIdEmulator(paymentId) {
        const res = await fetch(`${this.emulatorUrl}/v1/payments/${paymentId}`);
        if (!res.ok)
            throw new Error('Error on search for payment with id: ' + paymentId);
        // Retorna no mesmo shape que o PaymentResponse do SDK do MP
        return (await res.json());
    }
}
//# sourceMappingURL=index.js.map