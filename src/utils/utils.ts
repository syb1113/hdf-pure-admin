//将阅览量处理
export function formatNumber(value: string | number): string | number {
  const num =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

  if (typeof num !== "number" || isNaN(num)) {
    return value;
  }

  if (num > 10000) {
    const formattedValue = (num / 10000).toFixed(2).replace(/\.?0+$/, "");
    return `${formattedValue}w`;
  }

  return value;
}
