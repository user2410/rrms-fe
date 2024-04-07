import { ContractAFormValues } from "./create_contract_a";
import { ContractBFormValues } from "./create_contract_b";

export type ContractFormValues = ContractAFormValues & {
  sides: ContractAFormValues['sides'] & ContractBFormValues;
  // paymentMethod: ContractAFormValues['paymentMethod']
  // paymentDay: ContractAFormValues['paymentDay']
  // nCopies: ContractAFormValues['nCopies']
  // createdAtPlace: ContractAFormValues['createdAtPlace']
  // content: ContractAFormValues['content']
}
