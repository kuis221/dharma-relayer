import React, {Component} from 'react';
import Spinner from '../spinner/spinner';
import './confirm.css';

class Confirm extends Component{
  render(){
    let {header, confirmText, cancelText, onConfirm, onCancel, isLoading} = this.props;

    return (
      <div className="confirm">
        <div className="confirm__row">
          <h5 className="confirm__header">{header}</h5>
        </div>
        {this.props.children}
        <div className="confirm__buttons">
            { isLoading ? <Spinner /> :
              <div className="confirm__btn-wrapper">
                <button
                  className="confirm__btn confirm__btn_confirm"
                  onClick={() => onConfirm && onConfirm()}>
                  {confirmText}
                </button>
                <button
                  className="confirm__btn confirm__btn_cancel"
                  onClick={() => onCancel && onCancel()}>
                  {cancelText}
                </button>
              </div>
            }
        </div>
      </div>
    );
  }
}

export default Confirm;