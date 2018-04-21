import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, change as changeForm } from 'redux-form';
import './place-loan-request.css';
import { showLoanConfirmation, getCollateralTokenLock } from '../../actions';
import { RELAYER_AMORTIZATION_FREQUENCIES } from '../../common/amortizationFrequencies';
import { SUPPORTED_TOKENS } from '../../common/api/config.js';
import PlaceLoanModal from "./PlaceLoanModal"
import ShareLoanModal from "./ShareLoanModal"
import { convertToRelayer } from "../../utils/relayer-adapter";
import { DEFAULT_LOAN_REQUEST, termValues, DAYS, PERIODS } from "./constants";

const floatOnly = (value) => {
  if (value === null || value === '' || value === undefined) {
    return ''
  }
  let v = value.toString().replace(/[^\d.]/g, '')
  v = v.slice(0, v.indexOf('.') >= 0 ? v.indexOf('.') + 6 : undefined)
  return v
};

const percentNormalize = value => floatOnly(value) / 100;
const percentFormat = value => value * 100;
const required = value => (value ? false : true);

class PlaceLoanRequest extends Component {

  constructor(props) {
    super(props);

    this.renderCurrencyOptions = this.renderCurrencyOptions.bind(this);
  }

  state = {
    isShareLoanModalOpen: false,
  }

  getAmortizationPeriod = amortizationFrequency =>
    PERIODS.find(period => period.value === amortizationFrequency)

  placeLoanRequestClick = (values) => {
    console.log("values")
    console.log(values)
    const amortizationPeriod = this.getAmortizationPeriod(values.amortizationFrequency)
    this.props.showLoanConfirmation({
      ...values,
      amortizationFrequency: values.amortizationFrequency || termValues[values.term].amortizationFrequencies[0],
      amortizationUnit: amortizationPeriod && amortizationPeriod.dharmaUnit,
    });
  }

  renderCurrencyOptions() {
    return SUPPORTED_TOKENS.map(symbol => {
      return (<option key={symbol} value={symbol}>{symbol}</option>);
    });
  }

  termChange({ target }, newValue) {
    this.props.changeAmortizationFrequency(target.value);
  }

  openShareModal = () =>
    this.setState({ isShareLoanModalOpen: true })

  closeShareModal = () =>
    this.setState({ isShareLoanModalOpen: false })

  handleSignedLoanRequest = () =>
    this.openShareModal()

  submitShareLoan = (e) => {
    e.preventDefault()
    const { requestJson } = e.target.elements
    try {
      if (requestJson) {
        const relayer = convertToRelayer(JSON.parse(requestJson.value))
        this.closeShareModal()
        this.placeLoanRequestClick(DEFAULT_LOAN_REQUEST)
      }
    } catch (err) {
      alert(err)
    }
  }

  render() {
    const { handleSubmit, valid, amortizationFrequency } = this.props;

    return (
      <div className="loan-request-form">
        <div className="loan-request-form__header">
          New loan request <br/>
          <a
            className="loan-request-link"
            href="javascript:void(0)"
            onClick={this.handleSignedLoanRequest}
          >
            Already have signed loan request?
          </a>
        </div>
        <div className="loan-request-form__row loan-request-amount">
          <div className="loan-request-form__label-wrapper">
            <label className="loan-request-form__label">Amount</label>
          </div>
          <div className="loan-request-form__input-wrapper">
            <Field
              name="amount"
              className="loan-request-form__input"
              placeholder="0"
              component="input"
              validate={required}
              normalize={floatOnly}/>
          </div>
          <div className="loan-request-form__select-wrapper">
            <Field name="currency" className="loan-request-form__select" component="select">
              {this.renderCurrencyOptions()}
            </Field>
          </div>
        </div>
        <div className="loan-request-form__row">
          <div className="loan-request-form__label-wrapper">
            <label className="loan-request-form__label">Term</label>
          </div>
          <div className="loan-request-form__row loan-request-amount loan-request-input-wrapper">
            <Field name="term" className="loan-request-form__select loan-request-select-wrapper" component="select">
              {
                DAYS.map(day => <option key={day} value={day}>{day}</option>)
              }
            </Field>
            <Field name="term_period" className="loan-request-form__select" component="select"
                   onChange={this.termChange.bind(this)}>
              {
                PERIODS.map(({ title, value }) => <option key={title} value={value}>{title}</option>)
              }
            </Field>
          </div>
        </div>
        <div className="loan-request-form__row">
          <div className="loan-request-form__label-wrapper">
            <label className="loan-request-form__label">Payment</label>
          </div>
          <div className="loan-request-form__select-wrapper">
            <Field disabled name="amortizationFrequency" className="loan-request-form__select" component="select">
              <option value={amortizationFrequency}>{amortizationFrequency}</option>
            </Field>
          </div>
        </div>
        <div className="loan-request-form__row">
          <div className="loan-request-form__label-wrapper">
            <label className="loan-request-form__label">Interest</label>
          </div>
          <div className="loan-request-form__input-wrapper">
            <Field
              name="interestRate"
              className="loan-request-form__input"
              placeholder="per loan term, %"
              component="input"
              validate={required}
              format={percentFormat}
              normalize={percentNormalize}/>
          </div>
        </div>

        <div className="loan-request-form__row loan-request-amount">
          <div className="loan-request-form__label-title">
            <label className="loan-request-form__label loan-request-form__label_collateral">Collateral
              (optional)</label>
          </div>
        </div>

        <div className="loan-request-form__row loan-request-amount">
          <div className="loan-request-form__label-wrapper">
            <label className="loan-request-form__label">Amount</label>
          </div>
          <div className="loan-request-form__input-wrapper">
            <Field
              name="collateralAmount"
              className="loan-request-form__input"
              placeholder="0"
              component="input"
              normalize={floatOnly}/>
          </div>
          <div className="loan-request-form__select-wrapper">
            <Field name="collateralType" className="loan-request-form__select" component="select">
              {this.renderCurrencyOptions()}
            </Field>
          </div>
        </div>
        <div className="loan-request-form__place-btn-wrapper">
          <button
            className={"loan-request-form__place-btn " + (valid ? "" : "loan-request-form_disabled")}
            onClick={handleSubmit(this.placeLoanRequestClick.bind(this))}>
            PLACE LOAN REQUEST
          </button>
        </div>
        <PlaceLoanModal/>
        <ShareLoanModal
          isOpen={this.state.isShareLoanModalOpen}
          handleClose={this.closeShareModal}
          onSubmit={this.submitShareLoan}
        />
      </div>
    );
  }
}

const selector = formValueSelector('LoanRequestForm');

const mapStateToProps = state => ({
  amortizationFrequency: selector(state, 'amortizationFrequency'),
});

const mapDispatchToProps = (dispatch) => ({
  changeAmortizationFrequency(value) {
    dispatch(changeForm('LoanRequestForm', 'amortizationFrequency', value))
  },
  showLoanConfirmation(debtOrder) {
    dispatch(showLoanConfirmation(debtOrder));
    dispatch(getCollateralTokenLock(debtOrder.collateralType));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'LoanRequestForm',
  initialValues: {
    interestRate: 0.01,
    term: 7,
    amortizationFrequency: RELAYER_AMORTIZATION_FREQUENCIES["HOURLY"],
    currency: SUPPORTED_TOKENS[0],
    collateralType: SUPPORTED_TOKENS[0]
  }
})(PlaceLoanRequest));
