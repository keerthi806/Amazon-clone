import { formatCurrency } from "../../scripts/utils/price.js";

describe('test suite: formatCurrency()', () => {
  it('converts cents to dollars', () =>{
    expect(formatCurrency(2095)).toEqual('20.95');
  });

  it('works with 0', () => {
    expect(formatCurrency(0)).toEqual('0.00');
  });

  it('rounds up to nearest cent', () => {
    expect(formatCurrency(2000.5)).toEqual('20.01');
  });

  it('rounds down to nearest cent', () => {
    expect(formatCurrency(2000.4)).toEqual('20.00');
  })

  it('rounds negative numbers', () => {
    expect(formatCurrency(-2000.5)).toEqual('-20.00');
    expect(formatCurrency(-2000.8)).toEqual('-20.01');
  });
});