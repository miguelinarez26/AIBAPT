"use client";

import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Loader2, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutClientProps {
  applicationId: string;
  lang: 'es' | 'pt';
  amount: number;
  label: string;
}

export default function CheckoutClient({ applicationId, lang, amount, label }: CheckoutClientProps) {
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleStripeCheckout = async () => {
    try {
      setIsStripeLoading(true);
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId, lang }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Error al iniciar pago con Stripe');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(lang === 'es' ? 'Error al procesar el pago con tarjeta' : 'Erro ao processar o pagamento com cartão');
      setIsStripeLoading(false);
    }
  };

  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "EUR",
    intent: "capture",
  };

  if (paymentSuccess) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 bg-white dark:bg-dark-card rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-serif text-text-dark mb-4">
          {lang === 'es' ? '¡Pago Exitoso!' : 'Pagamento Efetuado!'}
        </h2>
        <p className="text-text-light mb-8">
          {lang === 'es' 
            ? 'Tu solicitud de membresía ha sido registrada y está pendiente de revisión.' 
            : 'Sua solicitação de membresia foi registrada e está pendente de revisão.'}
        </p>
        <button
          onClick={() => window.location.href = `/${lang}/dashboard`}
          className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition-colors"
        >
          {lang === 'es' ? 'Ir al Dashboard' : 'Ir para o Dashboard'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 pb-24 items-stretch">
      {/* Order Summary */}
      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 flex flex-col h-full">
        <h2 className="text-xl font-serif text-text-dark mb-6">
          {lang === 'es' ? 'Resumen de Orden' : 'Resumo do Pedido'}
        </h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
            <span className="text-text-light">{lang === 'es' ? 'Trámite' : 'Trâmite'}</span>
            <span className="font-medium text-text-dark text-right">Membresía AIBAPT</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
            <span className="text-text-light">{lang === 'es' ? 'Categoría' : 'Categoria'}</span>
            <span className="font-medium text-text-dark text-right">{label}</span>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-lg font-serif text-text-dark">Total</span>
            <span className="text-3xl font-bold text-primary">€{amount}</span>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="flex items-center text-sm text-white dark:text-white bg-secondary dark:bg-secondary p-4 rounded-xl border border-secondary shadow-sm">
            <ShieldCheck className="w-6 h-6 text-white dark:text-white mr-3 flex-shrink-0" />
            <p className="font-medium">{lang === 'es' ? 'Procesamiento de pago seguro y cifrado. Tu información está protegida.' : 'Processamento de pagamento seguro e criptografado. Suas informações estão protegidas.'}</p>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="h-full">
        <div className="bg-highlight dark:bg-highlight rounded-3xl shadow-sm border border-highlight/50 p-8 h-full flex flex-col">
          <h2 className="text-xl font-serif text-text-dark mb-6">
            {lang === 'es' ? 'Selecciona tu método de pago' : 'Selecione sua forma de pagamento'}
          </h2>

          <div className="space-y-4">
            <button
              onClick={handleStripeCheckout}
              disabled={isStripeLoading}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 disabled:opacity-50"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-text-dark">
                    {lang === 'es' ? 'Tarjeta de Crédito / Débito' : 'Cartão de Crédito / Débito'}
                  </p>
                  <p className="text-sm text-text-light">Procesado por Stripe</p>
                </div>
              </div>
              {isStripeLoading ? <Loader2 className="w-5 h-5 animate-spin text-text-light" /> : null}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10 dark:border-black/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-highlight dark:bg-highlight px-4 text-sm font-medium text-amber-900/60 dark:text-amber-900/60">O usa PayPal</span>
              </div>
            </div>

            <div className="z-0 relative rounded-2xl overflow-hidden mt-auto">
              <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons
                  style={{ layout: "vertical", shape: "rect", color: "blue" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "EUR",
                            value: amount.toString(),
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const res = await fetch('/api/paypal/capture', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          orderId: data.orderID,
                          applicationId,
                        }),
                      });

                      const captureData = await res.json();
                      if (captureData.success) {
                        setPaymentSuccess(true);
                        toast.success(lang === 'es' ? 'Pago procesado exitosamente' : 'Pagamento processado com sucesso');
                      } else {
                        throw new Error(captureData.error || 'Error al capturar el pago');
                      }
                    } catch (error) {
                      console.error(error);
                      toast.error(lang === 'es' ? 'Error al procesar el pago con PayPal' : 'Erro ao processar o pagamento com PayPal');
                    }
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
