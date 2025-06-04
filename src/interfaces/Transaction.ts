export interface ITransaction {
    date: Date,
    sign: string,
    amount: number,
    currency: string,
    organisation: string,
    location: string,
    category: string,
    description: string,
  }

export class Transaction implements ITransaction {
  constructor(
    public date: Date,
    public sign: string,
    public amount: number,
    public currency: string,
    public organisation: string,
    public location: string,
    public category: string,
    public description: string
  ) {}

  getFormattedAmount(): string {
    return `${this.sign}${this.amount} ${this.currency}`;
  }
}

export class RecurringTransaction extends Transaction {
  constructor(
    date: Date,
    sign: string,
    amount: number,
    currency: string,
    organisation: string,
    location: string,
    category: string,
    description: string,
    public frequency: 'daily' | 'weekly' | 'monthly'
  ) {
    super(date, sign, amount, currency, organisation, location, category, description);
  }

  getRecurringInfo(): string {
    return `${this.getFormattedAmount()} occurs ${this.frequency}`;
  }
}

