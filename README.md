# Pix Payment (Mercado Pago)

Uma biblioteca simples e tipada para criação e consulta de pagamentos via **PIX** utilizando a API do Mercado Pago.

---

## 📦 Instalação

Adicione no seu `package.json`:

```json
"dependencies": {
  "pix_generator": "git+https://github.com/eliezer-dev-software-enginner/pix-payment.git"
}
```

Ou via terminal:

```bash
npm install git+https://github.com/eliezer-dev-software-enginner/pix-payment.git
```

---

## ⚙️ Configuração

Você precisa de um **Access Token do Mercado Pago**.

```ts
import { PixService } from 'pix_generator';

const pixService = new PixService('SEU_ACCESS_TOKEN');
```

---

## 🚀 Criando um pagamento PIX

```ts
const result = await pixService.createPixPayment({
  email: 'cliente@email.com',
  firstName: 'João',
  lastName: 'Silva',
  description: 'Pagamento do pedido #123',
  externalRef: 'pedido-123',
  value: 100,
});
```

---

## 📄 Resposta

### Sucesso

```ts
{
  success: true,
  data: {
    paymentId: "123456",
    qrCodeBase64: "base64...",
    qrCode: "copia e cola...",
    status: "pending"
  },
  error: null
}
```

### Erro

```ts
{
  success: false,
  data: null,
  error: "mensagem de erro"
}
```

---

## 🔎 Consultar pagamento

```ts
const payment = await pixService.getPaymentById('PAYMENT_ID');
```

---

## 🧱 Tipagens

### PaymentData

```ts
type PaymentData = {
  email: string;
  description: string;
  firstName: string;
  lastName: string;
  externalRef: string;
  value: number;
  metadata?: Record<string, any>;
};
```

### PixPaymentResult

```ts
type PixPaymentResult = {
  success: boolean;
  data: {
    paymentId: string;
    qrCodeBase64: string | null;
    qrCode: string | null;
    status: string;
  } | null;
  error: string | null;
};
```

---

## ⚠️ Regras e validações

- Access Token não pode ser vazio
- Valor da transação deve ser maior que zero

---

## 🧠 Como funciona

A biblioteca encapsula o SDK do Mercado Pago e simplifica:

- Criação de pagamento PIX
- Extração de QR Code
- Consulta de status

---

## 📌 Dependências

- mercadopago

---

## 📄 Licença

MIT
