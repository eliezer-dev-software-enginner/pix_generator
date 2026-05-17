# Pix Payment (Mercado Pago)

Uma biblioteca simples e tipada para criação e consulta de pagamentos via **PIX** utilizando a API do Mercado Pago. Suporta modo emulador para testes locais.

---

## 📦 Instalação

```bash
npm install git+https://github.com/eliezer-dev-software-enginner/pix-payment.git
```

---

## ⚙️ Configuração

A biblioteca recebe um objeto `PixConfig` com o access token e, opcionalmente, a configuração do emulador.

```ts
import { PixService } from 'pix_generator';

const pixService = new PixService({
  accessToken: 'SEU_ACCESS_TOKEN',
});
```

---

## 🧪 Modo emulador

Para testes locais, ative o emulador. Quando habilitado, as requisições são redirecionadas para o [mercadopago-pix-emulator](https://github.com/eliezer-dev-software-enginner/mercadopago-pix-emulator) em vez da API real do Mercado Pago.

```ts
const pixService = new PixService({
  accessToken: 'SEU_ACCESS_TOKEN',
  emulator: {
    enabled: true,
    url: 'http://localhost:3001', // opcional, este é o default
  },
});
```

Uso recomendado com variável de ambiente:

```ts
const pixService = new PixService({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  emulator: {
    enabled: process.env.NODE_ENV === 'development',
    url: process.env.PIX_EMULATOR_URL,
  },
});
```

```env
# .env.local
MP_ACCESS_TOKEN=SEU_TOKEN
PIX_EMULATOR_URL=http://localhost:3001
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
  notificationUrl: 'https://seu-app.com/api/checkout/webhook', // opcional
  metadata: { userId: 'abc', romId: 'xyz' }, // opcional
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

### PixConfig

```ts
type PixConfig = {
  accessToken: string;
  emulator?: {
    enabled: boolean;
    url?: string; // default: http://localhost:3001
  };
};
```

### PaymentData

```ts
type PaymentData = {
  email: string;
  description: string;
  firstName: string;
  lastName: string;
  externalRef: string;
  value: number;
  notificationUrl?: string;
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

- `accessToken` não pode ser vazio
- `value` deve ser maior que zero

---

## 🧠 Como funciona

A biblioteca encapsula o SDK do Mercado Pago e simplifica:

- Criação de pagamento PIX
- Extração de QR Code
- Consulta de status por ID

Em modo emulador, as requisições são feitas diretamente para o servidor local, mantendo o mesmo contrato de resposta da API real.

---

## 📌 Dependências

- `mercadopago`

---

## 📄 Licença

MIT
