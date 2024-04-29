export type Supplier = {
  supplier_id: number;
  name: string;
  icon: string;
  status: string;
  group_id: number;
  query_types: {
    type: number;
    name: string;
    sample_bill_link: string;
    args: {
      name: string;
      label: string;
      format: string;
    }[];
  }[];
};

export type SupplierGroup = {
  supplier_group_id: number;
  name: string;
  icon: string;
  display: boolean;
};

export type CaptchaResponse = {
  captcha_id: string;
  base64_image: string;
}

export type Bill = {
  app_id: number;
  supplier_id: number;
  provider_code: string;
  customer_code: string;
  customer_name: string;
  customer_address: string;
  customer_date_of_birth: string;
  customer_identity_number: string;
  total_amount: number;
  payment_rule: number;
  update_time: number;
  bills: any[];
}
