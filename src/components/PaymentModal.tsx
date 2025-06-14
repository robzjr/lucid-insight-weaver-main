import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Zap, Star, AlertCircle, CreditCard, Wallet, CreditCardIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  isDark?: boolean;
}

type PaymentProvider = 'paymob' | 'paypal';

// Add PayPal SDK script
declare global {
  interface Window {
    paypal?: any;
  }
}

// Define types for our database schema
interface PaymentTransaction {
  id: string;
  user_id: string;
  amount_cents: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payment_provider: 'paymob' | 'paypal';
  package_name: string;
  interpretations_granted: number;
  paypal_order_id?: string;
  paymob_transaction_id?: string;
  created_at?: string;
  payment_date?: string;
}

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, isDark = true }: PaymentModalProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paymob');
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const paymentPackages = [
    {
      id: 'basic',
      name: 'Basic Pack',
      interpretations: 10,
      price: 49.99,
      currency: 'EGP',
      icon: <Sparkles className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      interpretations: 25,
      price: 99.99,
      currency: 'EGP',
      icon: <Zap className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 'unlimited',
      name: 'Ultimate Pack',
      interpretations: 100,
      price: 199.99,
      currency: 'EGP',
      icon: <Star className="h-6 w-6" />,
      color: 'from-orange-500 to-red-500',
      popular: false
    }
  ];

  // Load PayPal SDK
  useEffect(() => {
    if (selectedProvider === 'paypal' && !paypalLoaded) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=EGP&components=buttons`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [selectedProvider, paypalLoaded]);

  const handlePackageSelect = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    if (!user || !selectedPackage) {
      toast.error('Please log in to continue');
      return;
    }
    setIsProcessing(true);
    setShowConfirmation(false);
    try {
      const { data: transaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          amount_cents: Math.round(selectedPackage.price * 100),
          currency: selectedPackage.currency,
          interpretations_granted: selectedPackage.interpretations,
          status: 'pending',
          payment_provider: selectedProvider
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      let paymentData;
      if (selectedProvider === 'paymob') {
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: {
            transactionId: transaction.id,
            amount: selectedPackage.price,
            currency: selectedPackage.currency,
            packageName: selectedPackage.name,
            interpretations: selectedPackage.interpretations
          }
        });
        if (error) throw error;
        paymentData = data;
      } else {
        const { data, error } = await supabase.functions.invoke('create-paypal-payment', {
          body: {
            transactionId: transaction.id,
            amount: selectedPackage.price,
            currency: selectedPackage.currency,
            packageName: selectedPackage.name,
            interpretations: selectedPackage.interpretations
          }
        });
        if (error) throw error;
        paymentData = data;
      }

      if (paymentData?.paymentUrl || paymentData?.approvalUrl) {
        window.open(paymentData.paymentUrl || paymentData.approvalUrl, '_blank');
        toast.success('Redirecting to payment...');
        onClose();
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  const handlePayPalPayment = async (selectedPackage: any) => {
    try {
      setIsProcessing(true);
      
      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user?.id,
          amount_cents: selectedPackage.price * 100, // Convert to cents
          currency: 'EGP',
          status: 'pending',
          payment_provider: 'paypal',
          package_name: selectedPackage.name,
          interpretations_granted: selectedPackage.interpretations,
        } as PaymentTransaction)
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Create PayPal order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-paypal-payment', {
        body: {
          transactionId: transaction.id,
          amount: selectedPackage.price,
          currency: 'EGP',
          packageName: selectedPackage.name,
          interpretations: selectedPackage.interpretations,
        },
      });

      if (orderError) throw orderError;

      return orderData.orderId;
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast.error('Failed to initiate PayPal payment. Please try again.');
      setIsProcessing(false);
      return null;
    }
  };

  const handlePayPalApprove = async (data: { orderID: string }) => {
    try {
      // Capture the payment
      const { error: captureError } = await supabase.functions.invoke('capture-paypal-payment', {
        body: {
          orderId: data.orderID,
        },
      });

      if (captureError) throw captureError;

      // Update transaction status
      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({ 
          status: 'completed',
          payment_date: new Date().toISOString(),
        })
        .eq('paypal_order_id', data.orderID);

      if (updateError) throw updateError;

      // Update user's usage
      const { error: usageError } = await supabase
        .from('user_usage')
        .upsert({
          user_id: user?.id,
          interpretations_remaining: selectedPackage?.interpretations || 0,
          last_updated: new Date().toISOString(),
        });

      if (usageError) throw usageError;

      toast.success('Payment successful! You can now interpret your dreams.');
      onPaymentSuccess();
      onClose();
    } catch (error) {
      console.error('PayPal capture error:', error);
      toast.error('Failed to complete payment. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setSelectedPackage(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <DialogHeader>
            <DialogTitle className={`text-center text-2xl hologram-text ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Unlock More Dream Interpretations
            </DialogTitle>
            <p className={`text-center ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Choose a package to continue your dream journey with Ramel
            </p>
          </DialogHeader>

          {/* Payment Provider Selection */}
          <div className={`mt-6 p-4 rounded-lg border ${
            isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Select Payment Method
            </h3>
            <RadioGroup
              value={selectedProvider}
              onValueChange={(value) => setSelectedProvider(value as PaymentProvider)}
              className="flex flex-col space-y-3"
            >
              <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                selectedProvider === 'paymob' 
                  ? isDark ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50'
                  : isDark ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <RadioGroupItem value="paymob" id="paymob" />
                <Label htmlFor="paymob" className={`flex items-center space-x-2 cursor-pointer ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <CreditCard className="h-5 w-5" />
                  <span>Credit Card (Paymob)</span>
                </Label>
              </div>
              <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                selectedProvider === 'paypal'
                  ? isDark ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50'
                  : isDark ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className={`flex items-center space-x-2 cursor-pointer ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <CreditCardIcon className="h-5 w-5" />
                  <span>PayPal</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {paymentPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative transition-all duration-300 hover:scale-105 ${
                  pkg.popular 
                    ? 'ring-2 ring-purple-500 ring-opacity-50' 
                    : ''
                } ${
                  isDark 
                    ? 'glass-card border-slate-700' 
                    : 'bg-white border-slate-200'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center text-white`}>
                    {pkg.icon}
                  </div>
                  <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</CardTitle>
                  <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{pkg.price} {pkg.currency}</div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{pkg.interpretations} interpretations</p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handlePackageSelect(pkg)}
                    disabled={isProcessing}
                    className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Choose Package'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className={`mt-6 p-4 rounded-lg border ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Secure Payment by {selectedProvider === 'paymob' ? 'Paymob' : 'PayPal'}
              </span>
            </div>
            <p className={`text-xs ${
              isDark ? 'text-slate-500' : 'text-slate-600'
            }`}>
              Your payment is processed securely through {selectedProvider === 'paymob' ? 'Paymob' : 'PayPal'}. You'll be redirected to complete your purchase.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={handleCancelConfirmation}>
        <DialogContent className={`max-w-md ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          <DialogHeader>
            <DialogTitle className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Confirm Your Purchase</DialogTitle>
            <DialogDescription className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Please review your purchase details before proceeding to payment.</DialogDescription>
          </DialogHeader>
          {selectedPackage && (
            <div className={`mt-4 p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Package:</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Interpretations:</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedPackage.interpretations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Total Amount:</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedPackage.price} {selectedPackage.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Payment Method:</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedProvider === 'paymob' ? 'Credit Card (Paymob)' : 'PayPal'}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className={`mt-4 p-3 rounded-lg border ${isDark ? 'bg-yellow-950/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-start space-x-2">
              <AlertCircle className={`h-5 w-5 mt-0.5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                You will be redirected to {selectedProvider === 'paymob' ? 'Paymob' : 'PayPal'} to complete your purchase.
              </p>
            </div>
          </div>
          <DialogFooter className="mt-6 space-x-2">
            <Button variant="outline" onClick={handleCancelConfirmation} className={`${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}>Cancel</Button>
            <Button onClick={handleConfirmPayment} disabled={isProcessing} className={`bg-gradient-to-r ${selectedPackage?.color || 'from-purple-500 to-pink-500'} text-white font-semibold`}>
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {paypalLoaded && selectedPackage && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.paypal.Buttons({
                style: {
                  shape: 'rect',
                  layout: 'vertical',
                  color: 'gold',
                  label: 'paypal',
                },
                createOrder: async () => {
                  const orderId = await window.handlePayPalPayment(${JSON.stringify(selectedPackage)});
                  return orderId;
                },
                onApprove: async (data) => {
                  await window.handlePayPalApprove(data);
                },
                onError: (err) => {
                  console.error('PayPal error:', err);
                  toast.error('Payment failed. Please try again.');
                }
              }).render('#paypal-button-container');
            `,
          }}
        />
      )}
    </>
  );
};

export default PaymentModal;
