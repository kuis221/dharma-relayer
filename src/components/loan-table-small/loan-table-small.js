import React from 'react';
import './loan-table-small.css';
import { isFloat, formatLoanscanLink, calculateTotalPaymentAmount, convertToRelayerAmortizationFrequency } from '../../common/services/utilities';
import { SHOW_LOANSCAN_LINK } from '../../common/api/config';
import Paging from '../../components/paging/paging.js';
import Spinner from '../../components/spinner/spinner.js';


function renderDate(row) {

  if (SHOW_LOANSCAN_LINK && row.issuanceHash) {
    return (
      <td className="loan-table-small__table-cell">
        <a href={formatLoanscanLink(row.issuanceHash)}
           target="_blank">{row.date.toLocaleDateString()} {row.date.toLocaleTimeString()}</a>
      </td>
    )
  }

  return (
    <td className="loan-table-small__table-cell">{row.date.toLocaleDateString()} {row.date.toLocaleTimeString()}</td>
  )
}

function renderRows(rows) {
  let i = 0;

  return rows
    .sort((a, b) => a.date < b.date ? 1 : (-1))
    .map(row => {

      const amount = row.principalAmount;
      const amountString = isFloat(amount) ? amount.toFixed(2) : amount;
      const interestRate = row.interestRate.toNumber();
      const totalRepayment = calculateTotalPaymentAmount(amount, interestRate);
      const repaymentString = isFloat(totalRepayment) ? totalRepayment.toFixed(2) : totalRepayment;
      const paymentPeriodFrequency = convertToRelayerAmortizationFrequency(row.amortizationUnit);

      return (
        <tr key={i++}>
          {renderDate(row)}
          <td className="loan-table-small__table-cell"><strong>{amountString}</strong> {row.principalTokenSymbol} </td>
          <td className="loan-table-small__table-cell"><strong>{interestRate * 100}</strong> %</td>
          <td className="loan-table-small__table-cell"><strong>{row.termLength}</strong> {row.amortizationUnit}</td>
          <td className="loan-table-small__table-cell"><strong>{repaymentString}</strong> {row.principalTokenSymbol}</td>
          <td className="loan-table-small__table-cell">{paymentPeriodFrequency}</td>
        </tr>
      );
    });
}

function renderPagination({ offset, totalItemsCount, pageSize, onPageClick }) {
  return (
    <div className="relayer-pagination">
      <Paging
        offset={offset}
        totalItemsCount={totalItemsCount}
        pageSize={pageSize}
        onPageClick={onPageClick}
        visiblePagesCount={5}/>
    </div>
  );
}

function LoanTableSmall(props) {
  if (props.isLoading) {
    return (
      <div className="loan-table-small__spinner-container">
        <Spinner/>
      </div>
    );
  }
  return (
    <React.Fragment>
      <div className="loan-table-small scrollable-table">
        <div className="loan-table-small__header">
          {props.header}
        </div>
        <table className="loan-table-small__table">
          <thead>
          <tr>
            <th className="loan-table-small__table-header" title={props.dateColumnHeader}>Date</th>
            <th className="loan-table-small__table-header" title="Loan amount">Amount</th>
            <th className="loan-table-small__table-header" title="Interest rate per loan term">Interest</th>
            <th className="loan-table-small__table-header" title="Loan term">Term</th>
            <th className="loan-table-small__table-header" title="Total Repayment">Total Repayment</th>
            <th className="loan-table-small__table-header" title="Repayment Frequency">Repayment Frequency</th>
          </tr>
          </thead>
          <tbody className="loan-table-small__table-body scrollable-table__table-body scrollable">
          {renderRows(props.rows)}
          </tbody>
        </table>
      </div>
      {props.showPaging && renderPagination(props)}
    </React.Fragment>
  );
}

export default LoanTableSmall;