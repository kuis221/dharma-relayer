import React from 'react';
import './balances-table.css';
import Slider from '../slider/slider.js';


let data = [
  {
    id: 'OMG',
    name: 'OmiseGo',
    amount: 0.003,
    unlocked: false
  },
  {
    id: 'WETH',
    name: 'Wrapped Ether',
    amount: 0.23,
    unlocked: true
  }
];

function renderRows(rows){
  return rows.map(row => {
    return (
      <tr key={row.id}>
        <td className="balances-table__table-cell">
          <span className="balances-table__asset-id">{row.id}</span>
          <br/>
          {row.name}
        </td>
        <td className="balances-table__table-cell">
          <span className="balances-table__balance-value">
            {row.amount}
          </span>
        </td>
        <td className="balances-table__table-cell">
          <Slider on={row.unlocked} />
        </td>
      </tr>
    );
  });
}

function BalancesTable(props) {
  return (
    <div className="balances-table scrollable-table">
      <div className="balances-table__header">
        Your Balances
      </div>
      <hr/>
      <div className="balances-table__table-wrapper">
        <table className="balances-table__table balances-table__table_stripe">
          <thead>
          <tr>
            <th className="balances-table__table-header" title="Asset">Asset</th>
            <th className="balances-table__table-header" title="Available Balances">Available Balance</th>
            <th className="balances-table__table-header" title="Unlocked">Unlocked</th>
          </tr>
          </thead>
          <tbody className="balances-table__table-body scrollable-table__table-body scrollable">
          {renderRows(data)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BalancesTable;