export interface LoanReport {

  monthList: string[];
  emiData: DataSet
  paidData: DataSet
}

export interface DataSet {
  data: number[];
  label: string;
  fill?: boolean;
}
