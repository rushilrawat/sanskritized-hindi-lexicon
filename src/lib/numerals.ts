const devDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export const toDevanagariNumerals = (input: string | number): string =>
  String(input).replace(/[0-9]/g, (d) => devDigits[Number(d)]);

export const formatNumber = (input: string | number, hindiMode: boolean): string =>
  hindiMode ? toDevanagariNumerals(input) : String(input);
