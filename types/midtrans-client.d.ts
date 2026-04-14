declare module 'midtrans-client' {
  export interface MidtransOptions {
    isProduction: boolean;
    serverKey: string | undefined;
    clientKey?: string | undefined;
  }

  export class Snap {
    constructor(options: MidtransOptions);
    createTransaction(parameter: any): Promise<any>;
    createTransactionToken(parameter: any): Promise<string>;
    createTransactionRedirectUrl(parameter: any): Promise<string>;
  }

  export class CoreApi {
    constructor(options: MidtransOptions);
    charge(parameter: any): Promise<any>;
    capture(parameter: any): Promise<any>;
    approve(parameter: any): Promise<any>;
    deny(parameter: any): Promise<any>;
    cancel(parameter: any): Promise<any>;
    expire(parameter: any): Promise<any>;
    refund(parameter: any): Promise<any>;
    refundDirect(parameter: any): Promise<any>;
    status(parameter: any): Promise<any>;
    statusBinds(parameter: any): Promise<any>;
  }

  const midtransClient: {
    Snap: typeof Snap;
    CoreApi: typeof CoreApi;
  };

  export default midtransClient;
}
