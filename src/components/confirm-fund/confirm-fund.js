import React, {Component} from 'react';
import Confirm from '../confirm/confirm';
import {calculateNumberOfPayments, calculateRepaymentAmount, calculateTotalPaymentAmount} from '../../common/services/utilities';
import * as amortizationValues from '../../common/amortizationFrequencies';



class ConfirmFund extends Component{
  render(){
    let {onConfirm, onCancel, loanRequest} = this.props;

    let amount = loanRequest.principalAmount;
    let token = loanRequest.dharmaDebtOrder.principalTokenSymbol;
    let termLength = loanRequest.dharmaDebtOrder.termLength.toNumber();
    let amortizationUnit = loanRequest.dharmaDebtOrder.amortizationUnit;
    let interest = loanRequest.dharmaDebtOrder.interestRate.toNumber();

    let termInDays = termLength;
    let amortizationFrequency = null;

    if(amortizationUnit === "hours"){
      termInDays = termLength / 24;
    }
    else if(amortizationUnit === "days"){
      termInDays = termLength;
      amortizationFrequency = amortizationValues.DAILY;
    }
    else if(amortizationUnit === "weeks"){
      termInDays = termLength * 7;
      amortizationFrequency = amortizationValues.WEEKLY;
    }
    else if(amortizationUnit === "months"){
      termInDays = termLength * 30;
      amortizationFrequency = amortizationValues.MONTHLY;
    }
    else if(amortizationUnit === "years"){
      termInDays = amortizationUnit * 365;
    }

    let numberOfPayments = calculateNumberOfPayments(amortizationFrequency, termInDays);
    let repaymentAmount = calculateRepaymentAmount(amount, interest);
    let totalPaymentAmount = calculateTotalPaymentAmount(repaymentAmount, termLength);

    return (
      <Confirm
        header="You are about to fund a loan with the following terms:"
        confirmText="FUND"
        cancelText="CANCEL"
        onConfirm={() => onConfirm(loanRequest)}
        onCancel={onCancel}>

        <div className="confirm__row">
          Loan amount: {amount} {token}
        </div>
        <div className="confirm__row">
          Loan term: {termInDays} days
        </div>
        <div className="confirm__row">
          Maximum interest rate willing to pay: {interest} %
        </div>
        <div className="confirm__row">
          Collateral amount: ?????
        </div>
        <div className="confirm__row">
          Total loan repayment amount: {repaymentAmount} {token}
        </div>
        <div className="confirm__row">
          Number of payments: {termLength}
        </div>
        <div className="confirm__row">
          Payment frequency: {amortizationFrequency}
        </div>
        <div className="confirm__row">
          Payment amount: {totalPaymentAmount} {token}
        </div>
        <br/>
        <hr/>
      </Confirm>
    );
  }
}


export default ConfirmFund;