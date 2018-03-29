import {createDebtOrder} from '../common/services/dharmaService';
import debtsApi from '../common/api/debts';
import * as amortizationFrequencies from '../common/amortizationFrequencies';

export const PLACE_LOAN = 'PLACE_LOAN';
export const PLACE_LOAN_SUCCESS = 'PLACE_LOAN_SUCCESS';
export const PLACE_LOAN_FAIL = 'PLACE_LOAN_FAIL';

export function placeLoanRequest({amount, currency, maxInterest, term, amortizationFrequency}, callback){
  return dispatch => {
    dispatch({
      type: PLACE_LOAN
    });

    let amortizationUnit = 'days';
    term = term * 1;
    if (amortizationFrequency === amortizationFrequencies.WEEKLY){
      amortizationUnit = 'weeks';
      term = term / 7;
    }
    else if (amortizationFrequency === amortizationFrequencies.MONTHLY){
      amortizationUnit = 'months';
      term = term / 30;
    }
    else if (amortizationFrequency === amortizationFrequencies.END){
      alert(`${amortizationFrequencies.END} is not currently supported`);
      dispatch({
        type:PLACE_LOAN_FAIL
      });
      return;
    }

    let debtOrderInfo = {
      principalTokenSymbol: currency,
      principalAmount: amount,
      interestRate: maxInterest,
      amortizationUnit: amortizationUnit,
      termLength: term
    };

    console.log('placeLoanRequest', debtOrderInfo);

    return createDebtOrder(debtOrderInfo)
      .then(debtOrder => debtsApi.post(debtOrder))
      .then(resp => {
        alert('Placed successfully!');
        callback();
        dispatch({
          type: PLACE_LOAN_SUCCESS
        });
      });
  };
}