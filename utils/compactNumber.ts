import numbro from 'numbro';

export default function compactNumber(number: number, mantissa: number = 2) {
  return numbro(number).format({ average: true, optionalMantissa: true, mantissa })
}