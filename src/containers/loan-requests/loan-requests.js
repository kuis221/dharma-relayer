import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getLoanRequests, fillLoanRequest, showFundConfirmation, hideFundConfirmation, setLoanRequestsOffset } from '../../actions';
import LoanRequestsTable from '../../components/loan-request-table/loan-request-table';
import FundLoanModal from '../../components/fund-loan-modal/FundLoanModal';
import Spinner from '../../components/spinner/spinner.js';
import Paging from '../../components/paging/paging.js';
import './loan-requests.css';
import '../../common/styles/pagination.css';

const pageSize = 18;

let timer = null;
let startTimer = (func) => {
    timer = setTimeout(() => {
        func();
        startTimer(func);
    }, 5000)
};

class LoanRequests extends Component {

    constructor(props){
        super(props);

        this.getLoanRequestsForCurrentPage = this.getLoanRequestsForCurrentPage.bind(this);
    }

    componentDidMount(){
        let {getLoanRequestsForCurrentPage} = this;
        getLoanRequestsForCurrentPage();
        startTimer(getLoanRequestsForCurrentPage);
    }

    getLoanRequestsForCurrentPage(){
        let {offset, getLoanRequests} = this.props;
        let currentPageNum = Math.floor(offset/pageSize);

        getLoanRequests(pageSize * currentPageNum, pageSize);
    }

    componentWillUnmount(){
        timer && clearTimeout(timer);
    }

    renderPagination(){
        let {getLoanRequests, setLoanRequestsOffset, offset, totalItemsCount} = this.props;

        return (
              <Paging
                offset={offset}
                totalItemsCount={totalItemsCount}
                pageSize={pageSize}
                onPageClick={(pageNum) => {
                        setLoanRequestsOffset(pageSize * pageNum);
                        getLoanRequests(pageSize * pageNum, pageSize);
                    }
                }
                visiblePagesCount={10} />
        );
    }

    render() {
        let {loanRequests, fundConfirmation, showFundConfirmation, hideFundConfirmation, fillLoan, isLoading, showPaging} = this.props;

        if(isLoading){
            return (
              <div className="loan-requests__spinner-container">
                  <Spinner/>
              </div>
            );
        }

        return (
            <div>
                <LoanRequestsTable header="Loan Requests" rows={loanRequests} onFundClick={showFundConfirmation}/>
                <div className="relayer-pagination">
                    {showPaging && this.renderPagination()}
                </div>
                {fundConfirmation.loanRequest && <FundLoanModal/>}
            </div>
        );
    }
}

let mapStateToProps = ({loanRequests, fundConfirmation, fillLoan}) => ({
    loanRequests: loanRequests.values,
    isLoading: loanRequests.isLoading,
    fundConfirmation,
    fillLoan,
    offset:loanRequests.offset,
    showPaging: loanRequests.showPaging,
    totalItemsCount: loanRequests.totalItemsCount
});

let mapDispatchToProps = { getLoanRequests, fillLoanRequest, showFundConfirmation, hideFundConfirmation, setLoanRequestsOffset };

export default connect(mapStateToProps, mapDispatchToProps)(LoanRequests);
