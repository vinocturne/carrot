export function cls(...classnames: string[]) {
    return classnames.join(" ");
}

export function priceFormat(price: number | undefined) {
    const stringPrice = price + "";
    return stringPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
