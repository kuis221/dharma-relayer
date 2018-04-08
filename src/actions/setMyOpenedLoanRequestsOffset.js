
export const SET_MY_OPENED_LOAN_REQUESTS_OFFSET = 'SET_MY_OPENED_LOAN_REQUESTS_OFFSET';

export  function setMyOpenedLoanRequestsOffset(offset){
  return{
    type:SET_MY_OPENED_LOAN_REQUESTS_OFFSET,
    offset
  }
}