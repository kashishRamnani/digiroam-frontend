// PayPalWebView.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { apiManager } from '../api';
import { createOrderId } from '../store/main/mainThunk';
import { useDispatch } from 'react-redux';

const PayPalWebView = ({ route, packageInfoList, onSuccess, onFail }) => {
    const { amount, currency } = route.params;
    const [orderId, setOrderId] = useState('');
    const [approvalUrl, setApprovalUrl] = useState('');
    const dispatch = useDispatch();

    // yahan par items ko retrieve karo neeche useEffect mein hamne thunk ko call kiya hai ya api hit mari hai.

    useEffect(() => {
        const createOrder = async () => {
            try {
                const data = {
                    // talha yahan par mene amount to total items se calculate karke uthaya hai
                    // items wo hein to hamare pas cart mein pare huwe hein
                    amount: items.reduce(
                        (total, item) => total + getPriceWithMarkup(item.productPrice, pricePercentage) * item.productQuantity, 0
                    ),
                    currency,
                };

                const res = await dispatch(createOrderId(data)).unwrap();
                console.log(res);
                const orderId = res.orderId;
                setOrderId(orderId);

                const url = `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`; // sandbox or live
                setApprovalUrl(url);
            } catch (err) {
                Alert.alert('Error', 'Could not create PayPal order');
                console.log(err);
                onFail();
            }
        };

        createOrder();

        // TODO
        // talha yahn par /settings wali api call karni hai jahan par price percentage mile ga
        // talha yahan par thunk dispatch karo jis se current user ke sare cart items mill jayein, ya api hit karo
    }, []);

    const handleNavigationChange = async navState => {
        const { url } = navState;

        if (url.includes('success') && orderId) {
            try {
                const captureRes = await apiManager.post(
                    '/payment/paypal/captureOrder',
                    {
                        orderId,
                        currency_code: currency,
                    },
                );

                const {
                    transactionId,
                    amount: capturedAmount,
                    currency_code,
                    payer,
                } = captureRes.data;

                await apiManager.post('/eSim/orderProfiles', {
                    transactionId,
                    amount: String(capturedAmount), // talha ye amount string hona chahiye so changed to string
                    packageInfoList,
                });

                // talha yahan par mene items par loop chalaya hai items wo hein jo abhi hamare pas cart mein pare huwe hein
                const amount = items.reduce((total, { productPrice, productQuantity }) => total + Number(getPriceWithMarkup(productPrice, pricePercentage) * 10000).toFixed(2) * productQuantity, 0);
                const saveRes = await apiManager.post('/paymentSave/store', {
                    transactionId,
                    amount: String(amount), // talha yahan par bhi mene amount ko string mein convert kiya hai
                    currency: currency_code,
                    payer,
                    // mene yahan par price mein price percentage ka markup add kiya hai aur usko cent mein convert karke save kiya hai
                    packageInfoList: packageInfoList?.map((pkg) => ({ ...pkg, price: (getPriceWithMarkup(pkg.price / 10000, pricePercentage) * 10000) })),
                    orderNo: orderId,
                });

                if (saveRes.status === 201) {
                    onSuccess();
                } else {
                    onFail();
                }
            } catch (error) {
                Alert.alert('Error', 'Something went wrong while capturing the order.');
                onFail();
            }
        }
    };

    if (!approvalUrl) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <WebView
            source={{ uri: approvalUrl }}
            onNavigationStateChange={handleNavigationChange}
            startInLoadingState
            javaScriptEnabled
            style={{ flex: 1 }}
        />
    );
};

// utility function to get the price with markup
export const getPriceWithMarkup = (price, markupPercentage) => {
    const markup = price * ((markupPercentage ?? 1) / 100);
    return Number(price + markup).toFixed(2);
};

export default PayPalWebView;